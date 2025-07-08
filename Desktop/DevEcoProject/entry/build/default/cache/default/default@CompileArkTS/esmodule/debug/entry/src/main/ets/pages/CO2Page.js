import http from '@ohos:net.http';
class CO2Page extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__co2 = new ObservedPropertySimplePU('--', this, "co2");
        this.__unit = new ObservedPropertySimplePU('ppm', this, "unit");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__lastUpdate = new ObservedPropertySimplePU('从未更新', this, "lastUpdate");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__warningLevel = new ObservedPropertySimplePU(0, this, "warningLevel");
        this.timerId = 0;
        this.httpRequest = http.createHttp();
        this.UPDATE_INTERVAL = 5000;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.co2 !== undefined) {
            this.co2 = params.co2;
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
        if (params.warningLevel !== undefined) {
            this.warningLevel = params.warningLevel;
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
        this.__co2.purgeDependencyOnElmtId(rmElmtId);
        this.__unit.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdate.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__warningLevel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__co2.aboutToBeDeleted();
        this.__unit.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__lastUpdate.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__warningLevel.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get co2() {
        return this.__co2.get();
    }
    set co2(newValue) {
        this.__co2.set(newValue);
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
    get warningLevel() {
        return this.__warningLevel.get();
    }
    set warningLevel(newValue) {
        this.__warningLevel.set(newValue);
    }
    aboutToAppear() {
        this.fetchCO2Data();
        this.timerId = setInterval(() => {
            this.fetchCO2Data();
        }, this.UPDATE_INTERVAL);
    }
    aboutToDisappear() {
        clearInterval(this.timerId);
        this.httpRequest.destroy();
    }
    async fetchCO2Data(retryCount = 3) {
        if (retryCount <= 0) {
            this.handleError('网络请求失败，重试次数已用尽');
            return;
        }
        try {
            this.isLoading = true;
            this.errorMessage = '';
            this.warningLevel = 0;
            const url = 'http://192.168.0.169:81/api/data/CO2';
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                console.log('Raw Data:', rawData);
                if (rawData.length > 0) {
                    const data = rawData[0];
                    if (data.value.dioxide !== undefined) {
                        const co2Value = parseFloat(data.value.dioxide);
                        this.co2 = co2Value.toFixed(0);
                        // 设置警告级别
                        if (co2Value < 400 || co2Value > 1000) {
                            this.warningLevel = co2Value > 1500 ? 2 : 1;
                        }
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
                    this.fetchCO2Data(retryCount - 1);
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
    handleError(message) {
        console.error(`CO₂ 数据获取失败: ${message}`);
        this.errorMessage = `错误: ${message}`;
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
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(20);
            Column.backgroundColor('#F8F8F8');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题栏
            Row.create();
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
            Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
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
            Text.create('二氧化碳浓度监测');
            Text.fontSize(24);
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
            // 主显示区域
            Stack.create();
            // 主显示区域
            Stack.margin({ bottom: 30 });
            if (!isInitialRender) {
                // 主显示区域
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 背景圆形
            Circle.create({ width: 220, height: 220 });
            // 背景圆形
            Circle.fill(this.getCircleColor());
            // 背景圆形
            Circle.opacity(0.1);
            if (!isInitialRender) {
                // 背景圆形
                Circle.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 主数值
            Column.create();
            if (!isInitialRender) {
                // 主数值
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.co2);
            Text.fontSize(60);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getTextColor());
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.unit);
            Text.fontSize(24);
            Text.fontColor('#666666');
            Text.margin({ top: -10 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 主数值
        Column.pop();
        // 主显示区域
        Stack.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 状态指示器
            Row.create();
            // 状态指示器
            Row.margin({ bottom: 20 });
            if (!isInitialRender) {
                // 状态指示器
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.getStatusText());
            Text.fontSize(16);
            Text.fontColor(this.getTextColor());
            Text.padding(8);
            Text.backgroundColor(this.getStatusBgColor());
            Text.borderRadius(20);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 状态指示器
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 数据更新时间
            Row.create();
            if (!isInitialRender) {
                // 数据更新时间
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777227, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.width(16);
            Image.height(16);
            Image.margin({ right: 5 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`最后更新: ${this.lastUpdate}`);
            Text.fontSize(14);
            Text.fontColor('#888888');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 数据更新时间
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            // 加载或错误状态
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.color('#007AFF');
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ top: 20 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.margin({ top: 20 });
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                        Image.margin({ right: 5 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(this.errorMessage);
                        Text.fontSize(14);
                        Text.fontColor('#FF3B30');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    Row.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 信息卡片
            Column.create();
            // 信息卡片
            Column.width('90%');
            // 信息卡片
            Column.padding(15);
            // 信息卡片
            Column.margin({ top: 30 });
            // 信息卡片
            Column.backgroundColor('#FFFFFF');
            // 信息卡片
            Column.borderRadius(12);
            // 信息卡片
            Column.shadow({ radius: 6, color: '#20000000', offsetX: 0, offsetY: 2 });
            if (!isInitialRender) {
                // 信息卡片
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('CO₂浓度参考值');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
            Text.margin({ bottom: 10 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Row.create();
            if (!isInitialRender) {
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.margin({ right: 20 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('400-1000 ppm');
            Text.fontSize(14);
            Text.fontColor('#34C759');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('正常范围');
            Text.fontSize(12);
            Text.fontColor('#888888');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.margin({ right: 20 });
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('1000-1500 ppm');
            Text.fontSize(14);
            Text.fontColor('#FF9500');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('警告');
            Text.fontSize(12);
            Text.fontColor('#888888');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('>1500 ppm');
            Text.fontSize(14);
            Text.fontColor('#FF3B30');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('危险');
            Text.fontSize(12);
            Text.fontColor('#888888');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        Row.pop();
        // 信息卡片
        Column.pop();
        Column.pop();
    }
    // 获取状态文本
    getStatusText() {
        switch (this.warningLevel) {
            case 1: return '警告: CO₂浓度偏高';
            case 2: return '危险: CO₂浓度过高';
            default: return 'CO₂浓度正常';
        }
    }
    // 获取圆形颜色
    getCircleColor() {
        switch (this.warningLevel) {
            case 1: return '#FF9500'; // 橙色
            case 2: return '#FF3B30'; // 红色
            default: return '#34C759'; // 绿色
        }
    }
    // 获取文本颜色
    getTextColor() {
        switch (this.warningLevel) {
            case 1: return '#FF9500'; // 橙色
            case 2: return '#FF3B30'; // 红色
            default: return '#333333'; // 黑色
        }
    }
    // 获取状态背景色
    getStatusBgColor() {
        switch (this.warningLevel) {
            case 1: return '#FFF4E5';
            case 2: return '#FFEBE6';
            default: return '#E8F5E9';
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { CO2Page };
//# sourceMappingURL=CO2Page.js.map