import http from '@ohos:net.http';
class WeatherPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__temp = new ObservedPropertySimplePU('--', this, "temp");
        this.__tempUnit = new ObservedPropertySimplePU('℃', this, "tempUnit");
        this.__humidity = new ObservedPropertySimplePU('--', this, "humidity");
        this.__humidityUnit = new ObservedPropertySimplePU('%', this, "humidityUnit");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__lastUpdate = new ObservedPropertySimplePU('从未更新', this, "lastUpdate");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.__warningLevel = new ObservedPropertySimplePU(0, this, "warningLevel");
        this.__comfortLevel = new ObservedPropertySimplePU('舒适', this, "comfortLevel");
        this.timerId = 0;
        this.httpRequest = http.createHttp();
        this.UPDATE_INTERVAL = 5000;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.temp !== undefined) {
            this.temp = params.temp;
        }
        if (params.tempUnit !== undefined) {
            this.tempUnit = params.tempUnit;
        }
        if (params.humidity !== undefined) {
            this.humidity = params.humidity;
        }
        if (params.humidityUnit !== undefined) {
            this.humidityUnit = params.humidityUnit;
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
        if (params.comfortLevel !== undefined) {
            this.comfortLevel = params.comfortLevel;
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
        this.__temp.purgeDependencyOnElmtId(rmElmtId);
        this.__tempUnit.purgeDependencyOnElmtId(rmElmtId);
        this.__humidity.purgeDependencyOnElmtId(rmElmtId);
        this.__humidityUnit.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdate.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
        this.__warningLevel.purgeDependencyOnElmtId(rmElmtId);
        this.__comfortLevel.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__temp.aboutToBeDeleted();
        this.__tempUnit.aboutToBeDeleted();
        this.__humidity.aboutToBeDeleted();
        this.__humidityUnit.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__lastUpdate.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        this.__warningLevel.aboutToBeDeleted();
        this.__comfortLevel.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get temp() {
        return this.__temp.get();
    }
    set temp(newValue) {
        this.__temp.set(newValue);
    }
    get tempUnit() {
        return this.__tempUnit.get();
    }
    set tempUnit(newValue) {
        this.__tempUnit.set(newValue);
    }
    get humidity() {
        return this.__humidity.get();
    }
    set humidity(newValue) {
        this.__humidity.set(newValue);
    }
    get humidityUnit() {
        return this.__humidityUnit.get();
    }
    set humidityUnit(newValue) {
        this.__humidityUnit.set(newValue);
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
    get comfortLevel() {
        return this.__comfortLevel.get();
    }
    set comfortLevel(newValue) {
        this.__comfortLevel.set(newValue);
    }
    aboutToAppear() {
        this.fetchWeatherData();
        this.timerId = setInterval(() => {
            this.fetchWeatherData();
        }, this.UPDATE_INTERVAL);
    }
    aboutToDisappear() {
        clearInterval(this.timerId);
        this.httpRequest.destroy();
    }
    async fetchWeatherData(retryCount = 3) {
        if (retryCount <= 0) {
            this.handleError('网络请求失败，重试次数已用尽');
            return;
        }
        try {
            this.isLoading = true;
            this.errorMessage = '';
            this.warningLevel = 0;
            const url = 'http://192.168.0.169:81/api/data/Weather';
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                if (rawData.length > 0) {
                    const data = rawData[0];
                    if (data.value.temp !== undefined && data.value.humi !== undefined) {
                        const tempValue = parseFloat(data.value.temp);
                        const humiValue = parseFloat(data.value.humi);
                        this.temp = tempValue.toFixed(1);
                        this.humidity = humiValue.toFixed(1);
                        this.evaluateComfortLevel(tempValue, humiValue);
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
                    this.fetchWeatherData(retryCount - 1);
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
    evaluateComfortLevel(temp, humidity) {
        if (temp > 30) {
            this.warningLevel = 2;
            this.comfortLevel = '酷热';
        }
        else if (temp > 28) {
            this.warningLevel = 1;
            this.comfortLevel = '炎热';
        }
        else if (temp > 24) {
            this.warningLevel = 0;
            this.comfortLevel = '温暖';
        }
        else if (temp > 18) {
            this.warningLevel = 0;
            this.comfortLevel = '舒适';
        }
        else if (temp > 10) {
            this.warningLevel = 0;
            this.comfortLevel = '凉爽';
        }
        else {
            this.warningLevel = 1;
            this.comfortLevel = '寒冷';
        }
        if (humidity > 80) {
            this.warningLevel = Math.max(this.warningLevel, 1);
            this.comfortLevel += ' (潮湿)';
        }
        else if (humidity < 30) {
            this.warningLevel = Math.max(this.warningLevel, 1);
            this.comfortLevel += ' (干燥)';
        }
    }
    handleError(message) {
        console.error(`天气数据获取失败: ${message}`);
        this.errorMessage = `错误: ${message}`;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    formatTime(date) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    getStatusColor() {
        switch (this.warningLevel) {
            case 1: return '#FFA500'; // warning - 橙色
            case 2: return '#FF4500'; // danger - 红色
            default: return '#32CD32'; // safe - 绿色
        }
    }
    getComfortSuggestion() {
        switch (this.comfortLevel.split(' ')[0]) {
            case '酷热': return '建议开启空调，保持通风，多补充水分';
            case '炎热': return '建议开启风扇，穿着轻薄衣物';
            case '温暖': return '适宜穿着短袖，注意防晒';
            case '舒适': return '理想的室内环境，保持当前状态';
            case '凉爽': return '适宜穿着长袖，注意保暖';
            case '寒冷': return '建议开启暖气，穿着保暖衣物';
            default: return '当前环境舒适度良好';
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/WeatherPage.ets(145:5)");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(20);
            Column.backgroundColor('#F2F6FA');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题栏
            Row.create();
            Row.debugLine("pages/WeatherPage.ets(147:7)");
            // 顶部标题栏
            Row.margin({ bottom: 24 });
            if (!isInitialRender) {
                // 顶部标题栏
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Image.create({ "id": 16777248, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
            Image.debugLine("pages/WeatherPage.ets(148:9)");
            Image.width(28);
            Image.height(28);
            Image.margin({ right: 8 });
            if (!isInitialRender) {
                Image.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('温湿度监测');
            Text.debugLine("pages/WeatherPage.ets(152:9)");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#2C3E50');
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
            // 两个圆圈显示温湿度
            Row.create({ space: 20 });
            Row.debugLine("pages/WeatherPage.ets(160:7)");
            // 两个圆圈显示温湿度
            Row.margin({ bottom: 20 });
            // 两个圆圈显示温湿度
            Row.alignItems(VerticalAlign.Center);
            if (!isInitialRender) {
                // 两个圆圈显示温湿度
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 温度圆
            Stack.create();
            Stack.debugLine("pages/WeatherPage.ets(162:9)");
            if (!isInitialRender) {
                // 温度圆
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Circle.create({ width: 180, height: 180 });
            Circle.debugLine("pages/WeatherPage.ets(163:11)");
            Circle.fill('#FF8C00');
            Circle.opacity(0.1);
            if (!isInitialRender) {
                Circle.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 4 });
            Column.debugLine("pages/WeatherPage.ets(167:11)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`${this.temp}${this.tempUnit}`);
            Text.debugLine("pages/WeatherPage.ets(168:13)");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF8C00');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('温度');
            Text.debugLine("pages/WeatherPage.ets(172:13)");
            Text.fontSize(14);
            Text.fontColor('#666666');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        // 温度圆
        Stack.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 湿度圆
            Stack.create();
            Stack.debugLine("pages/WeatherPage.ets(179:9)");
            if (!isInitialRender) {
                // 湿度圆
                Stack.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Circle.create({ width: 180, height: 180 });
            Circle.debugLine("pages/WeatherPage.ets(180:11)");
            Circle.fill('#00BFFF');
            Circle.opacity(0.1);
            if (!isInitialRender) {
                Circle.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create({ space: 4 });
            Column.debugLine("pages/WeatherPage.ets(184:11)");
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(`${this.humidity}${this.humidityUnit}`);
            Text.debugLine("pages/WeatherPage.ets(185:13)");
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#00BFFF');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('湿度');
            Text.debugLine("pages/WeatherPage.ets(189:13)");
            Text.fontSize(14);
            Text.fontColor('#666666');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        Column.pop();
        // 湿度圆
        Stack.pop();
        // 两个圆圈显示温湿度
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 舒适度显示
            Text.create(this.comfortLevel);
            Text.debugLine("pages/WeatherPage.ets(199:7)");
            // 舒适度显示
            Text.fontSize(18);
            // 舒适度显示
            Text.fontWeight(FontWeight.Medium);
            // 舒适度显示
            Text.fontColor(this.getStatusColor());
            // 舒适度显示
            Text.padding({ left: 12, right: 12, top: 6, bottom: 6 });
            // 舒适度显示
            Text.backgroundColor('#FFFFFF');
            // 舒适度显示
            Text.borderRadius(16);
            // 舒适度显示
            Text.shadow({ radius: 2, color: '#22000000' });
            // 舒适度显示
            Text.margin({ bottom: 12 });
            if (!isInitialRender) {
                // 舒适度显示
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        // 舒适度显示
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 状态信息区域
            Column.create();
            Column.debugLine("pages/WeatherPage.ets(210:7)");
            // 状态信息区域
            Column.margin({ top: 8 });
            if (!isInitialRender) {
                // 状态信息区域
                Column.pop();
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
                        Row.create();
                        Row.debugLine("pages/WeatherPage.ets(212:11)");
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.debugLine("pages/WeatherPage.ets(213:13)");
                        LoadingProgress.color('#1E90FF');
                        LoadingProgress.width(24);
                        LoadingProgress.height(24);
                        LoadingProgress.margin({ right: 8 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('加载中...');
                        Text.debugLine("pages/WeatherPage.ets(218:13)");
                        Text.fontSize(14);
                        Text.fontColor('#1E90FF');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    Row.pop();
                });
            }
            else if (this.errorMessage) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("pages/WeatherPage.ets(223:11)");
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/WeatherPage.ets(224:13)");
                        Image.width(16);
                        Image.height(16);
                        Image.margin({ right: 6 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(this.errorMessage);
                        Text.debugLine("pages/WeatherPage.ets(228:13)");
                        Text.fontSize(14);
                        Text.fontColor('#FF0000');
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
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Row.create();
                        Row.debugLine("pages/WeatherPage.ets(233:11)");
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777222, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.debugLine("pages/WeatherPage.ets(234:13)");
                        Image.width(16);
                        Image.height(16);
                        Image.margin({ right: 6 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create(`最后更新: ${this.lastUpdate}`);
                        Text.debugLine("pages/WeatherPage.ets(238:13)");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
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
        // 状态信息区域
        Column.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 舒适度建议卡片
            Column.create();
            Column.debugLine("pages/WeatherPage.ets(247:7)");
            // 舒适度建议卡片
            Column.width('90%');
            // 舒适度建议卡片
            Column.padding(18);
            // 舒适度建议卡片
            Column.margin({ top: 24 });
            // 舒适度建议卡片
            Column.backgroundColor('#FFFFFF');
            // 舒适度建议卡片
            Column.borderRadius(14);
            // 舒适度建议卡片
            Column.shadow({ radius: 6, color: '#18000000' });
            if (!isInitialRender) {
                // 舒适度建议卡片
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('舒适度建议');
            Text.debugLine("pages/WeatherPage.ets(248:9)");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.margin({ bottom: 8 });
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.getComfortSuggestion());
            Text.debugLine("pages/WeatherPage.ets(253:9)");
            Text.fontSize(14);
            Text.fontColor('#555555');
            Text.textAlign(TextAlign.Center);
            Text.lineHeight(22);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 舒适度建议卡片
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { WeatherPage };
//# sourceMappingURL=WeatherPage.js.map