import http from '@ohos:net.http';
class LEDPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__illumination = new ObservedPropertySimplePU('--', this, "illumination");
        this.__unit = new ObservedPropertySimplePU('lx', this, "unit");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__lastUpdate = new ObservedPropertySimplePU('从未更新', this, "lastUpdate");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.timerId = 0;
        this.httpRequest = http.createHttp();
        this.UPDATE_INTERVAL = 5000;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.illumination !== undefined) {
            this.illumination = params.illumination;
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
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.timerId !== undefined) {
            this.timerId = params.timerId;
        }
        if (params.httpRequest !== undefined) {
            this.httpRequest = params.httpRequest;
        }
        if (params.UPDATE_INTERVAL !== undefined) {
            this.UPDATE_INTERVAL = params.UPDATE_INTERVAL;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__illumination.purgeDependencyOnElmtId(rmElmtId);
        this.__unit.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdate.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__illumination.aboutToBeDeleted();
        this.__unit.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__lastUpdate.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get illumination() {
        return this.__illumination.get();
    }
    set illumination(newValue) {
        this.__illumination.set(newValue);
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
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue) {
        this.__isRefreshing.set(newValue);
    }
    aboutToAppear() {
        this.fetchLEDData();
        this.startAutoRefresh();
    }
    aboutToDisappear() {
        this.stopAutoRefresh();
        this.httpRequest.destroy();
    }
    startAutoRefresh() {
        this.timerId = setInterval(() => {
            this.fetchLEDData();
        }, this.UPDATE_INTERVAL);
    }
    stopAutoRefresh() {
        clearInterval(this.timerId);
    }
    async fetchLEDData(retryCount = 3) {
        if (retryCount <= 0) {
            this.handleError('网络请求失败，重试次数已用尽');
            return;
        }
        try {
            if (!this.isRefreshing) {
                this.isLoading = true;
            }
            this.errorMessage = '';
            const url = 'http://192.168.0.169:81/api/data/light';
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                if (rawData.length > 0) {
                    const data = rawData[0];
                    if (data.value.illumination !== undefined) {
                        this.illumination = data.value.illumination;
                        this.unit = 'lx';
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
                this.handleError(`HTTP错误: ${response.responseCode}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                this.handleError(error.message);
                setTimeout(() => {
                    this.fetchLEDData(retryCount - 1);
                }, 1000);
            }
            else {
                this.handleError('未知错误');
            }
        }
        finally {
            this.isLoading = false;
            this.isRefreshing = false;
            this.lastUpdate = this.formatTime(new Date());
        }
    }
    handleError(message) {
        console.error(`LED 数据获取失败: ${message}`);
        this.errorMessage = `错误: ${message}`;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    formatTime(date) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    onRefresh() {
        this.isRefreshing = true;
        this.fetchLEDData();
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/LEDPage.ets(103:5)");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor('#F8F9FA');
            Column.padding(20);
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题栏
            Row.create();
            Row.debugLine("pages/LEDPage.ets(105:7)");
            // 顶部标题栏
            Row.margin({ bottom: 30 });
            if (!isInitialRender) {
                // 顶部标题栏
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777246, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("pages/LEDPage.ets(106:9)");
            Image.width(40);
            Image.height(40);
            Image.margin({ right: 10 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('LED亮度监测');
            Text.debugLine("pages/LEDPage.ets(110:9)");
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#333333');
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
            Column.debugLine("pages/LEDPage.ets(118:7)");
            // 主卡片
            Column.padding(20);
            // 主卡片
            Column.borderRadius(15);
            // 主卡片
            Column.backgroundColor('#FFFFFF');
            // 主卡片
            Column.shadow({ radius: 10, color: '#E0E0E0', offsetX: 0, offsetY: 2 });
            // 主卡片
            Column.margin({ bottom: 20 });
            if (!isInitialRender) {
                // 主卡片
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 亮度显示卡片
            Stack.create();
            Stack.debugLine("pages/LEDPage.ets(120:9)");
            // 亮度显示卡片
            Stack.width(320);
            // 亮度显示卡片
            Stack.height(320);
            // 亮度显示卡片
            Stack.margin({ bottom: 30 });
            if (!isInitialRender) {
                // 亮度显示卡片
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/LEDPage.ets(121:11)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 背景圆形
            Circle.create({ width: 300, height: 300 });
            Circle.debugLine("pages/LEDPage.ets(123:13)");
            // 背景圆形
            Circle.fill('#FFFFFF');
            // 背景圆形
            Circle.shadow({ radius: 15, color: '#E0E0E0', offsetX: 0, offsetY: 5 });
            if (!isInitialRender) {
                // 背景圆形
                Circle.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 内容
            Column.create();
            Column.debugLine("pages/LEDPage.ets(128:13)");
            // 内容
            Column.position({ x: 0, y: 0 });
            // 内容
            Column.width('100%');
            // 内容
            Column.height('100%');
            // 内容
            Column.justifyContent(FlexAlign.Center);
            // 内容
            Column.alignItems(HorizontalAlign.Center);
            if (!isInitialRender) {
                // 内容
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.illumination);
            Text.debugLine("pages/LEDPage.ets(129:15)");
            Text.fontSize(60);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#4A4A4A');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.unit);
            Text.debugLine("pages/LEDPage.ets(134:15)");
            Text.fontSize(22);
            Text.fontColor('#7D7D7D');
            Text.margin({ top: -10 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 内容
        Column.pop();
        Column.pop();
        // 亮度显示卡片
        Stack.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 状态信息
            Column.create();
            Column.debugLine("pages/LEDPage.ets(151:9)");
            // 状态信息
            Column.alignItems(HorizontalAlign.Center);
            if (!isInitialRender) {
                // 状态信息
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.isLoading && !this.isRefreshing) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.debugLine("pages/LEDPage.ets(153:13)");
                        LoadingProgress.color('#4A90E2');
                        LoadingProgress.width(30);
                        LoadingProgress.height(30);
                        LoadingProgress.margin({ bottom: 10 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                });
            }
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("pages/LEDPage.ets(161:13)");
                        Row.margin({ bottom: 10 });
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('⚠️');
                        Text.debugLine("pages/LEDPage.ets(162:15)");
                        Text.fontSize(16);
                        Text.margin({ right: 5 });
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(this.errorMessage);
                        Text.debugLine("pages/LEDPage.ets(165:15)");
                        Text.fontSize(14);
                        Text.fontColor('#FF5252');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    Row.pop();
                });
            }
            else {
                If.branchId(1);
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            Row.debugLine("pages/LEDPage.ets(172:11)");
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('⏱');
            Text.debugLine("pages/LEDPage.ets(173:13)");
            Text.fontSize(14);
            Text.margin({ right: 5 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`最后更新: ${this.lastUpdate}`);
            Text.debugLine("pages/LEDPage.ets(176:13)");
            Text.fontSize(12);
            Text.fontColor('#9E9E9E');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Row.pop();
        // 状态信息
        Column.pop();
        // 主卡片
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 刷新按钮
            Button.createWithLabel('手动刷新', { type: ButtonType.Capsule });
            Button.debugLine("pages/LEDPage.ets(190:7)");
            // 刷新按钮
            Button.width(150);
            // 刷新按钮
            Button.height(40);
            // 刷新按钮
            Button.backgroundColor('#4A90E2');
            // 刷新按钮
            Button.fontColor('#FFFFFF');
            // 刷新按钮
            Button.onClick(() => this.onRefresh());
            // 刷新按钮
            Button.opacity(this.isLoading ? 0.6 : 1);
            // 刷新按钮
            Button.enabled(!this.isLoading);
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
export { LEDPage };
//# sourceMappingURL=LEDPage.js.map