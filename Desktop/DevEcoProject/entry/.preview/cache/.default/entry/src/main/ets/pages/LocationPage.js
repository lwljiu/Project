import http from '@ohos:net.http';
class LocationPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__location = new ObservedPropertySimplePU('纬度: --, 经度: --', this, "location");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__lastUpdate = new ObservedPropertySimplePU('从未更新', this, "lastUpdate");
        this.__errorMessage = new ObservedPropertySimplePU('', this, "errorMessage");
        this.timerId = 0;
        this.httpRequest = http.createHttp();
        this.UPDATE_INTERVAL = 5000;
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.location !== undefined) {
            this.location = params.location;
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
        this.__location.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__lastUpdate.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMessage.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__location.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__lastUpdate.aboutToBeDeleted();
        this.__errorMessage.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get location() {
        return this.__location.get();
    }
    set location(newValue) {
        this.__location.set(newValue);
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
    aboutToAppear() {
        this.fetchLocationData();
        this.timerId = setInterval(() => {
            this.fetchLocationData();
        }, this.UPDATE_INTERVAL);
    }
    aboutToDisappear() {
        clearInterval(this.timerId);
        this.httpRequest.destroy();
    }
    async fetchLocationData(retryCount = 3) {
        if (retryCount <= 0) {
            this.handleError('网络请求失败，重试次数已用尽');
            return;
        }
        try {
            this.isLoading = true;
            this.errorMessage = '';
            const url = 'http://192.168.3.4:81/api/data/Location'; // 确保这个URL是正确的
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.GET,
            });
            if (response.responseCode === 200) {
                const rawData = JSON.parse(response.result.toString());
                console.log('Raw Data:', rawData); // 打印原始数据，检查结构
                if (rawData.length > 0) {
                    const data = rawData[0];
                    if (data.value.lat !== undefined && data.value.lon !== undefined) {
                        // 确保lat和lon是字符串类型
                        this.location = `纬度: ${data.value.lat}, 经度: ${data.value.lon}`;
                    }
                    else {
                        this.handleError('API 数据格式错误，未找到 lat 或 lon 字段');
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
                    this.fetchLocationData(retryCount - 1);
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
        console.error(`定位数据获取失败: ${message}`);
        this.errorMessage = `错误: ${message}`;
        setTimeout(() => {
            this.errorMessage = '';
        }, 5000);
    }
    formatTime(date) {
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/LocationPage.ets(87:5)");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor('#F5F5F5');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题栏
            Text.create('定位数据');
            Text.debugLine("pages/LocationPage.ets(89:7)");
            // 顶部标题栏
            Text.fontSize(24);
            // 顶部标题栏
            Text.fontColor('#FF0000');
            // 顶部标题栏
            Text.margin({ bottom: 20 });
            if (!isInitialRender) {
                // 顶部标题栏
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        // 顶部标题栏
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 内容区域
            Row.create({ space: 20 });
            Row.debugLine("pages/LocationPage.ets(95:7)");
            // 内容区域
            Row.margin({ bottom: 20 });
            if (!isInitialRender) {
                // 内容区域
                Row.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 左侧定位数据
            Column.create({ space: 10 });
            Column.debugLine("pages/LocationPage.ets(97:9)");
            // 左侧定位数据
            Column.width('100%');
            if (!isInitialRender) {
                // 左侧定位数据
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create('当前位置');
            Text.debugLine("pages/LocationPage.ets(98:11)");
            Text.fontSize(18);
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Text.create(this.location);
            Text.debugLine("pages/LocationPage.ets(100:11)");
            Text.fontSize(24);
            Text.fontColor('#228B22');
            if (!isInitialRender) {
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        Text.pop();
        // 左侧定位数据
        Column.pop();
        // 内容区域
        Row.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            If.create();
            // 底部提示栏
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('数据加载中...');
                        Text.debugLine("pages/LocationPage.ets(110:9)");
                        Text.fontColor('#FF0000');
                        Text.margin({ top: 20 });
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
                        Text.create(this.errorMessage);
                        Text.debugLine("pages/LocationPage.ets(114:9)");
                        Text.fontColor('#FF0000');
                        Text.margin({ top: 20 });
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
                        Text.create(`最后更新: ${this.lastUpdate}`);
                        Text.debugLine("pages/LocationPage.ets(118:9)");
                        Text.fontSize(12);
                        Text.margin({ top: 20 });
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
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { LocationPage };
//# sourceMappingURL=LocationPage.js.map