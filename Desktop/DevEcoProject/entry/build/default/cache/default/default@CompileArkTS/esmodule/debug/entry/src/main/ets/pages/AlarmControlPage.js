// import http from '@ohos.net.http';
//
// @Component
// struct AlarmControlPage {
//   @State isLoading: boolean = false;
//   @State eventLog: string = '';
//   private httpRequest: http.HttpRequest = http.createHttp();
//
//   aboutToDisappear() {
//     this.httpRequest.destroy();
//   }
//
//   private async sendRequest(action: string) {
//     try {
//       this.isLoading = true;
//       this.eventLog = '';
//
//       // 请确保使用正确的IP地址和端口号
//       const url = `http://127.0.0.1:9001/${action}`;
//       const response: http.HttpResponse = await this.httpRequest.request(url, {
//         method: http.RequestMethod.POST,
//       });
//
//       if (response.responseCode === 200) {
//         this.eventLog = `${action.slice(11).replace('-', ' ')}成功`;
//       } else {
//         this.eventLog = `请求失败: HTTP错误 ${response.responseCode}`;
//       }
//     } catch (error) {
//       this.eventLog = `请求失败: ${error instanceof Error ? error.message : '未知错误'}`;
//     } finally {
//       this.isLoading = false;
//     }
//   }
//
//   build() {
//     Column() {
//       if (this.isLoading) {
//         LoadingProgress()
//           .width(50)
//           .height(50)
//           .margin({ bottom: 20 });
//         Text('正在发送请求...');
//       } else {
//         Column({ space: 20 }) {
//           // 文字说明
//           Text('当二氧化碳浓度超出设定值320ppm时，家庭安防管理启动。')
//             .fontSize(14)
//             .margin({ top: 20 });
//
//           // 事件日志
//           if (this.eventLog) {
//             Text(this.eventLog)
//               .fontColor(this.eventLog.includes('成功') ? '#4CAF50' : '#FF0000')
//               .margin({ top: 10 });
//           }
//
//           // 启动安防管理按钮
//           Button('启动安防管理')
//             .onClick(() => this.sendRequest('send-message-on'))
//             .type(ButtonType.Capsule)
//             .backgroundColor('#4CAF50')
//             .margin({ top: 10 });
//
//           // 停止安防管理按钮
//           Button('停止安防管理')
//             .onClick(() => this.sendRequest('send-message-off'))
//             .type(ButtonType.Capsule)
//             .backgroundColor('#FF0000')
//             .margin({ top: 10 });
//         }
//       }
//     }
//     .width('100%')
//     .height('100%')
//     .justifyContent(FlexAlign.Center)
//     .alignItems(HorizontalAlign.Center)
//     .backgroundColor('#F5F5F5');
//   }
// }
//
// export { AlarmControlPage };
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
            const url = `http://192.168.0.169:9001/${action}`;
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
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor('#F5F5F5');
            if (!isInitialRender) {
                Column.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 顶部标题
            Text.create('安防管理系统');
            // 顶部标题
            Text.fontSize(24);
            // 顶部标题
            Text.fontWeight(FontWeight.Bold);
            // 顶部标题
            Text.margin({ top: 30, bottom: 20 });
            // 顶部标题
            Text.fontColor('#333333');
            if (!isInitialRender) {
                // 顶部标题
                Text.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        // 顶部标题
        Text.pop();
        this.observeComponentCreation((elmtId, isInitialRender) => {
            ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
            // 主内容区域卡片
            Column.create();
            // 主内容区域卡片
            Column.width('90%');
            // 主内容区域卡片
            Column.padding(20);
            // 主内容区域卡片
            Column.borderRadius(16);
            // 主内容区域卡片
            Column.backgroundColor('#FAFAFA');
            // 主内容区域卡片
            Column.shadow({ radius: 12, color: '#20000000', offsetX: 0, offsetY: 6 });
            if (!isInitialRender) {
                // 主内容区域卡片
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
                        // 加载状态
                        Column.create();
                        // 加载状态
                        Column.width('100%');
                        // 加载状态
                        Column.height(200);
                        // 加载状态
                        Column.justifyContent(FlexAlign.Center);
                        // 加载状态
                        Column.alignItems(HorizontalAlign.Center);
                        if (!isInitialRender) {
                            // 加载状态
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        LoadingProgress.create();
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.color('#4CAF50');
                        LoadingProgress.margin({ bottom: 20 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('正在发送请求...');
                        Text.fontSize(16);
                        Text.fontColor('#666666');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    // 加载状态
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Column.create({ space: 20 });
                        Column.width('100%');
                        if (!isInitialRender) {
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        // 信息卡片
                        Column.create();
                        // 信息卡片
                        Column.width('90%');
                        // 信息卡片
                        Column.padding(15);
                        // 信息卡片
                        Column.borderRadius(12);
                        // 信息卡片
                        Column.backgroundColor('#FFFFFF');
                        // 信息卡片
                        Column.shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 4 });
                        if (!isInitialRender) {
                            // 信息卡片
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('系统说明');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#4CAF50');
                        Text.margin({ bottom: 10 });
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('当二氧化碳浓度超出设定值320ppm时，安防管理可以启动，也可以手动控制安防系统的状态。');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.textAlign(TextAlign.Center);
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    // 信息卡片
                    Column.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        If.create();
                        // 状态显示区域
                        if (this.eventLog) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Column.create();
                                    Column.width('90%');
                                    Column.padding(15);
                                    Column.borderRadius(12);
                                    Column.backgroundColor('#FFFFFF');
                                    Column.border({
                                        width: 1,
                                        color: this.eventLog.includes('成功') ? '#E8F5E9' : '#FFEBEE'
                                    });
                                    Column.shadow({ radius: 4, color: '#10000000', offsetX: 0, offsetY: 2 });
                                    if (!isInitialRender) {
                                        Column.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create(this.eventLog.includes('成功') ? '操作成功' : '操作失败');
                                    Text.fontSize(16);
                                    Text.fontWeight(FontWeight.Medium);
                                    Text.margin({ bottom: 5 });
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create(this.eventLog);
                                    Text.fontSize(14);
                                    Text.fontColor(this.eventLog.includes('成功') ? '#4CAF50' : '#FF5252');
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                                Column.pop();
                            });
                        }
                        // 按钮区域
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
                        // 按钮区域
                        Column.create({ space: 15 });
                        // 按钮区域
                        Column.width('100%');
                        // 按钮区域
                        Column.margin({ top: 20 });
                        if (!isInitialRender) {
                            // 按钮区域
                            Column.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Button.createWithLabel('启动安防管理', { type: ButtonType.Capsule });
                        Button.onClick(() => this.sendRequest('send-message-on'));
                        Button.width('80%');
                        Button.height(50);
                        Button.backgroundColor('#4CAF50');
                        Button.fontColor('#FFFFFF');
                        Button.fontSize(16);
                        Button.fontWeight(FontWeight.Medium);
                        Button.stateEffect(true);
                        if (!isInitialRender) {
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Button.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Button.createWithLabel('停止安防管理', { type: ButtonType.Capsule });
                        Button.onClick(() => this.sendRequest('send-message-off'));
                        Button.width('80%');
                        Button.height(50);
                        Button.backgroundColor('#FF5252');
                        Button.fontColor('#FFFFFF');
                        Button.fontSize(16);
                        Button.fontWeight(FontWeight.Medium);
                        Button.stateEffect(true);
                        if (!isInitialRender) {
                            Button.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Button.pop();
                    // 按钮区域
                    Column.pop();
                    Column.pop();
                });
            }
            if (!isInitialRender) {
                If.pop();
            }
            ViewStackProcessor.StopGetAccessRecording();
        });
        If.pop();
        // 主内容区域卡片
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export { AlarmControlPage };
//# sourceMappingURL=AlarmControlPage.js.map