import http from '@ohos:net.http';
class PressurePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__pressure = new ObservedPropertySimplePU('--', this, "pressure");
        this.__unit = new ObservedPropertySimplePU('hPa', this, "unit");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__lastUpdate = new ObservedPropertySimplePU('从未更新', this, "lastUpdate");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__trend = new ObservedPropertySimplePU('stable', this, "trend");
        this.timerId = 0;
        this.httpRequest = http.createHttp();
        this.lastPressureValue = null;
        this.PRIMARY_COLOR = '#4A6DA7';
        this.ERROR_COLOR = '#E74C3C';
        this.SUCCESS_COLOR = '#2ECC71';
        this.CARD_BG_COLOR = '#FFFFFF';
        this.BG_COLOR = '#F8F9FA';
        this.TEXT_SECONDARY = '#7F8C8D';
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.pressure !== undefined) {
            this.pressure = params.pressure;
        }
        if (params.unit !== undefined) {
            this.unit = params.unit;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.lastUpdate !== undefined) {
            this.lastUpdate = params.lastUpdate;
        }
        if (params.errorMessage !== undefined) {
            this.errorMessage = params.errorMessage;
        }
        if (params.trend !== undefined) {
            this.trend = params.trend;
        }
        if (params.timerId !== undefined) {
            this.timerId = params.timerId;
        }
        if (params.httpRequest !== undefined) {
            this.httpRequest = params.httpRequest;
        }
        if (params.lastPressureValue !== undefined) {
            this.lastPressureValue = params.lastPressureValue;
        }
        if (params.PRIMARY_COLOR !== undefined) {
            this.PRIMARY_COLOR = params.PRIMARY_COLOR;
        }
        if (params.ERROR_COLOR !== undefined) {
            this.ERROR_COLOR = params.ERROR_COLOR;
        }
        if (params.SUCCESS_COLOR !== undefined) {
            this.SUCCESS_COLOR = params.SUCCESS_COLOR;
        }
        if (params.CARD_BG_COLOR !== undefined) {
            this.CARD_BG_COLOR = params.CARD_BG_COLOR;
        }
        if (params.BG_COLOR !== undefined) {
            this.BG_COLOR = params.BG_COLOR;
        }
        if (params.TEXT_SECONDARY !== undefined) {
            this.TEXT_SECONDARY = params.TEXT_SECONDARY;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__pressure.purgeDependencyOnElmtId(rmElmtId);
        this.__unit.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdate.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__trend.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__pressure.aboutToBeDeleted();
        this.__unit.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__lastUpdate.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__trend.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get pressure() {
        return this.__pressure.get();
    }
    set pressure(newValue) {
        this.__pressure.set(newValue);
    }
    get unit() {
        return this.__unit.get();
    }
    set unit(newValue) {
        this.__unit.set(newValue);
    }
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue) {
        this.__isLoading.set(newValue);
    }
    get lastUpdate() {
        return this.__lastUpdate.get();
    }
    set lastUpdate(newValue) {
        this.__lastUpdate.set(newValue);
    }
    get errorMessage() {
        return this.__errorMessage.get();
    }
    set errorMessage(newValue) {
        this.__errorMessage.set(newValue);
    }
    get trend() {
        return this.__trend.get();
    }
    set trend(newValue) {
        this.__trend.set(newValue);
    }
    aboutToAppear() {
        this.fetchPressureData();
        this.timerId = setInterval(() => {
            this.fetchPressureData();
        }, 5000);
    }
    aboutToDisappear() {
        clearInterval(this.timerId);
        this.httpRequest.destroy();
    }
    async fetchPressureData(retryCount = 3) {
        if (retryCount <= 0) {
            this.handleError('网络请求失败，重试次数已用尽');
            return;
        }
        try {
            this.isLoading = true;
            this.errorMessage = '';
            const url = 'http://192.168.0.169:81/api/data/Pressure';
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.GET,
                connectTimeout: 3000,
                readTimeout: 3000
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                console.log('Raw Data:', rawData);
                if (rawData.length > 0) {
                    const data = rawData[0];
                    if (data.value.pressure !== undefined) {
                        const currentPressure = parseFloat(data.value.pressure);
                        this.updatePressureTrend(currentPressure);
                        this.pressure = currentPressure.toFixed(2);
                        this.lastPressureValue = currentPressure;
                    }
                    else {
                        this.handleError('API 数据格式错误');
                    }
                }
                else {
                    this.handleError('API 返回数据为空');
                }
            }
            else {
                this.handleError(`服务器错误: ${response.responseCode}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.handleError(error.message);
                setTimeout(() => {
                    this.fetchPressureData(retryCount - 1);
                }, 1000);
            }
            else {
                this.handleError('未知错误');
            }
        }
        finally {
            this.isLoading = false;
            this.lastUpdate = this.formatTime(new Date());
        }
    }
    updatePressureTrend(currentPressure) {
        if (this.lastPressureValue === null) {
            this.trend = 'stable';
            return;
        }
        const diff = currentPressure - this.lastPressureValue;
        if (Math.abs(diff) < 0.5) {
            this.trend = 'stable';
        }
        else if (diff > 0) {
            this.trend = 'up';
        }
        else {
            this.trend = 'down';
        }
    }
    handleError(message) {
        console.error(`压强数据获取失败: ${message}`);
        this.errorMessage = message;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    formatTime(date) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/PressurePage.ets(116:5)");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor(this.BG_COLOR);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题栏
            Row.create();
            Row.debugLine("pages/PressurePage.ets(118:7)");
            // 顶部标题栏
            Row.justifyContent(FlexAlign.Center);
            // 顶部标题栏
            Row.margin({ top: 20, bottom: 30 });
            if (!isInitialRender) {
                // 顶部标题栏
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("pages/PressurePage.ets(119:9)");
            Image.width(32);
            Image.height(32);
            Image.margin({ right: 12 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('压强监测');
            Text.debugLine("pages/PressurePage.ets(123:9)");
            Text.fontSize(26);
            Text.fontColor(this.PRIMARY_COLOR);
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 主卡片
            Column.create();
            Column.debugLine("pages/PressurePage.ets(132:7)");
            // 主卡片
            Column.width('90%');
            // 主卡片
            Column.padding(20);
            // 主卡片
            Column.backgroundColor(this.CARD_BG_COLOR);
            // 主卡片
            Column.borderRadius(15);
            // 主卡片
            Column.shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 4 });
            if (!isInitialRender) {
                // 主卡片
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 压强值显示
            Row.create();
            Row.debugLine("pages/PressurePage.ets(134:9)");
            // 压强值显示
            Row.justifyContent(FlexAlign.Center);
            if (!isInitialRender) {
                // 压强值显示
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.pressure);
            Text.debugLine("pages/PressurePage.ets(135:11)");
            Text.fontSize(48);
            Text.fontColor(this.PRIMARY_COLOR);
            Text.fontWeight(FontWeight.Bold);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/PressurePage.ets(140:11)");
            Column.margin({ left: 8, top: 8 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.unit);
            Text.debugLine("pages/PressurePage.ets(141:13)");
            Text.fontSize(18);
            Text.fontColor(this.PRIMARY_COLOR);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.trend === 'up') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/PressurePage.ets(146:15)");
                        Image.width(20);
                        Image.height(20);
                        Image.colorFilter(this.ERROR_COLOR);
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                });
            }
            else if (this.trend === 'down') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777256, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/PressurePage.ets(151:15)");
                        Image.width(20);
                        Image.height(20);
                        Image.colorFilter(this.SUCCESS_COLOR);
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('—');
                        Text.debugLine("pages/PressurePage.ets(156:15)");
                        Text.fontSize(20);
                        Text.fontColor('#95A5A6');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        Column.pop();
        // 压强值显示
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 分隔线
            Divider.create();
            Divider.debugLine("pages/PressurePage.ets(166:9)");
            // 分隔线
            Divider.strokeWidth(1);
            // 分隔线
            Divider.color('#ECF0F1');
            // 分隔线
            Divider.margin({ top: 15, bottom: 15 });
            if (!isInitialRender) {
                // 分隔线
                Divider.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 状态行
            Row.create();
            Row.debugLine("pages/PressurePage.ets(172:9)");
            // 状态行
            Row.justifyContent(FlexAlign.Center);
            if (!isInitialRender) {
                // 状态行
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.debugLine("pages/PressurePage.ets(174:13)");
                        LoadingProgress.width(20);
                        LoadingProgress.height(20);
                        LoadingProgress.color(this.PRIMARY_COLOR);
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('数据加载中...');
                        Text.debugLine("pages/PressurePage.ets(178:13)");
                        Text.fontSize(14);
                        Text.fontColor(this.TEXT_SECONDARY);
                        Text.margin({ left: 10 });
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/PressurePage.ets(183:13)");
                        Image.width(20);
                        Image.height(20);
                        Image.colorFilter(this.ERROR_COLOR);
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(this.errorMessage);
                        Text.debugLine("pages/PressurePage.ets(187:13)");
                        Text.fontSize(14);
                        Text.fontColor(this.ERROR_COLOR);
                        Text.margin({ left: 10 });
                        Text.maxLines(1);
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777223, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/PressurePage.ets(193:13)");
                        Image.width(20);
                        Image.height(20);
                        Image.colorFilter(this.SUCCESS_COLOR);
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(`更新于 ${this.lastUpdate}`);
                        Text.debugLine("pages/PressurePage.ets(197:13)");
                        Text.fontSize(14);
                        Text.fontColor(this.TEXT_SECONDARY);
                        Text.margin({ left: 10 });
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        // 状态行
        Row.pop();
        // 主卡片
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 刷新按钮
            Button.createWithLabel('手动刷新');
            Button.debugLine("pages/PressurePage.ets(212:7)");
            // 刷新按钮
            Button.width(160);
            // 刷新按钮
            Button.height(40);
            // 刷新按钮
            Button.margin({ top: 30 });
            // 刷新按钮
            Button.backgroundColor(this.PRIMARY_COLOR);
            // 刷新按钮
            Button.fontColor('#FFFFFF');
            // 刷新按钮
            Button.onClick(() => {
                this.fetchPressureData();
            });
            if (!isInitialRender) {
                // 刷新按钮
                Button.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        // 刷新按钮
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { PressurePage };
//# sourceMappingURL=PressurePage.js.map