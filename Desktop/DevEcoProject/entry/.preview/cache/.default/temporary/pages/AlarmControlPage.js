import http from '@ohos:net.http';
class AlarmControlPage extends ViewPU {
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
            // 请确保使用正确的IP地址和端口号
            const url = `http://127.0.0.1:9001/${action}`;
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
            Column.debugLine("pages/AlarmControlPage.ets(37:5)");
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
                        LoadingProgress.debugLine("pages/AlarmControlPage.ets(39:9)");
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
                        Text.debugLine("pages/AlarmControlPage.ets(43:9)");
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
                        Column.debugLine("pages/AlarmControlPage.ets(45:9)");
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 文字说明
                        Text.create('当二氧化碳浓度超出设定值320ppm时，家庭安防管理启动。');
                        Text.debugLine("pages/AlarmControlPage.ets(47:11)");
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
                                    Text.debugLine("pages/AlarmControlPage.ets(53:13)");
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
                        // 启动安防管理按钮
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
                        // 启动安防管理按钮
                        Button.createWithLabel('启动安防管理');
                        Button.debugLine("pages/AlarmControlPage.ets(59:11)");
                        // 启动安防管理按钮
                        Button.onClick(() => this.sendRequest('send-message-on'));
                        // 启动安防管理按钮
                        Button.type(ButtonType.Capsule);
                        // 启动安防管理按钮
                        Button.backgroundColor('#4CAF50');
                        // 启动安防管理按钮
                        Button.margin({ top: 10 });
                        if (!isInitialRender) {
                            // 启动安防管理按钮
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 启动安防管理按钮
                    Button.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 停止安防管理按钮
                        Button.createWithLabel('停止安防管理');
                        Button.debugLine("pages/AlarmControlPage.ets(66:11)");
                        // 停止安防管理按钮
                        Button.onClick(() => this.sendRequest('send-message-off'));
                        // 停止安防管理按钮
                        Button.type(ButtonType.Capsule);
                        // 停止安防管理按钮
                        Button.backgroundColor('#FF0000');
                        // 停止安防管理按钮
                        Button.margin({ top: 10 });
                        if (!isInitialRender) {
                            // 停止安防管理按钮
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    // 停止安防管理按钮
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
export { AlarmControlPage };
