import http from '@ohos:net.http';
class FanControlPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1) {
        super(parent, __localStorage, elmtId);
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__eventLog = new ObservedPropertySimplePU('', this, "eventLog");
        this.httpRequest = http.createHttp();
        this.setInitiallyProvidedValue(params);
    }
    setInitiallyProvidedValue(params) {
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.eventLog !== undefined) {
            this.eventLog = params.eventLog;
        }
        if (params.httpRequest !== undefined) {
            this.httpRequest = params.httpRequest;
        }
    }
    updateStateVars(params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__eventLog.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__eventLog.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue) {
        this.__isLoading.set(newValue);
    }
    get eventLog() {
        return this.__eventLog.get();
    }
    set eventLog(newValue) {
        this.__eventLog.set(newValue);
    }
    aboutToDisappear() {
        this.httpRequest.destroy();
    }
    async sendRequest(action) {
        try {
            this.isLoading = true;
            this.eventLog = '';
            const url = `http://127.0.0.1:9000/${action}`;
            const response = await this.httpRequest.request(url, {
                method: http.RequestMethod.POST,
            });
            if (response.responseCode === 200) {
                this.eventLog = `${action.slice(11).replace('-', ' ')}成功`;
            }
            else {
                this.eventLog = `请求失败: HTTP错误 ${response.responseCode}`;
            }
        }
        catch (error) {
            this.eventLog = `请求失败: ${error instanceof Error ? error.message : '未知错误'}`;
        }
        finally {
            this.isLoading = false;
        }
    }
    initialRender() {
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            Column.create();
            Column.debugLine("pages/FanControlPage.ets(36:5)");
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
            If.create();
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.debugLine("pages/FanControlPage.ets(38:9)");
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.margin({ bottom: 20 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('正在发送请求...');
                        Text.debugLine("pages/FanControlPage.ets(42:9)");
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Column.create({ space: 20 });
                        Column.debugLine("pages/FanControlPage.ets(44:9)");
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 文字说明
                        Text.create('温度超出设定值20°C时，智能新风管理启动。');
                        Text.debugLine("pages/FanControlPage.ets(46:11)");
                        // 文字说明
                        Text.fontSize(14);
                        // 文字说明
                        Text.margin({ top: 20 });
                        if (!isInitialRender) {
                            // 文字说明
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 文字说明
                    Text.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        If.create();
                        // 事件日志
                        if (this.eventLog) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create(this.eventLog);
                                    Text.debugLine("pages/FanControlPage.ets(52:13)");
                                    Text.fontColor(this.eventLog.includes('成功') ? '#4CAF50' : '#FF0000');
                                    Text.margin({ top: 10 });
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                            });
                        }
                        // 发送请求按钮
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
                        // 发送请求按钮
                        Button.createWithLabel('打开风扇');
                        Button.debugLine("pages/FanControlPage.ets(58:11)");
                        // 发送请求按钮
                        Button.onClick(() => this.sendRequest('send-message-on'));
                        // 发送请求按钮
                        Button.type(ButtonType.Capsule);
                        // 发送请求按钮
                        Button.backgroundColor('#4CAF50');
                        // 发送请求按钮
                        Button.margin({ top: 10 });
                        if (!isInitialRender) {
                            // 发送请求按钮
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 发送请求按钮
                    Button.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 关闭风扇按钮
                        Button.createWithLabel('关闭风扇');
                        Button.debugLine("pages/FanControlPage.ets(65:11)");
                        // 关闭风扇按钮
                        Button.onClick(() => this.sendRequest('send-message-off'));
                        // 关闭风扇按钮
                        Button.type(ButtonType.Capsule);
                        // 关闭风扇按钮
                        Button.backgroundColor('#FF0000');
                        // 关闭风扇按钮
                        Button.margin({ top: 10 });
                        if (!isInitialRender) {
                            // 关闭风扇按钮
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 关闭风扇按钮
                    Button.pop();
                    Column.pop();
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
export { FanControlPage };
