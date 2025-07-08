// import http from '@ohos.net.http';
//
// @Component
// struct FanControlPage {
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
//       const url = `http://127.0.0.1:9000/${action}`;
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
//           Text('温度超出设定值20°C时，智能新风管理启动。')
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
//           // 发送请求按钮
//           Button('打开风扇')
//             .onClick(() => this.sendRequest('send-message-on'))
//             .type(ButtonType.Capsule)
//             .backgroundColor('#4CAF50')
//             .margin({ top: 10 });
//
//           // 关闭风扇按钮
//           Button('关闭风扇')
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
// export { FanControlPage };
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
            const url = `http://192.168.0.169:9000/${action}`;
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
            Text.create('智能新风控制系统');
            // 顶部标题
            Text.fontSize(24);
            // 顶部标题
            Text.fontWeight(FontWeight.Bold);
            // 顶部标题
            Text.margin({ top: 30, bottom: 20 });
            // 顶部标题
            Text.fontColor('#2E7D32');
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
                        LoadingProgress.color('#2E7D32');
                        LoadingProgress.margin({ bottom: 20 });
                        if (!isInitialRender) {
                            LoadingProgress.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('正在连接设备...');
                        Text.fontSize(16);
                        Text.fontColor('#616161');
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
                        Text.create('温度监测');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor('#2E7D32');
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
                        Row.margin({ bottom: 8 });
                        if (!isInitialRender) {
                            Row.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Image.create({ "id": 16777254, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.margin({ right: 10 });
                        if (!isInitialRender) {
                            Image.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('当前温度: 25°C (设定阈值: 20°C)');
                        Text.fontSize(14);
                        Text.fontColor('#424242');
                        if (!isInitialRender) {
                            Text.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    });
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation((elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        Text.create('当温度超过20°C时，系统可启动新风管理');
                        Text.fontSize(14);
                        Text.fontColor('#616161');
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
                                        color: this.eventLog.includes('成功') ? '#C8E6C9' : '#FFCDD2'
                                    });
                                    Column.shadow({ radius: 4, color: '#10000000', offsetX: 0, offsetY: 2 });
                                    if (!isInitialRender) {
                                        Column.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Row.create();
                                    Row.margin({ bottom: 5 });
                                    if (!isInitialRender) {
                                        Row.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Image.create(this.eventLog.includes('成功') ? { "id": 16777252, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" } : { "id": 16777231, "type": 20000, params: [], "bundleName": "com.example.myapplication", "moduleName": "entry" });
                                    Image.width(20);
                                    Image.height(20);
                                    Image.margin({ right: 8 });
                                    if (!isInitialRender) {
                                        Image.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create(this.eventLog.includes('成功') ? '操作成功' : '操作失败');
                                    Text.fontSize(16);
                                    Text.fontWeight(FontWeight.Medium);
                                    if (!isInitialRender) {
                                        Text.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                });
                                Text.pop();
                                Row.pop();
                                this.observeComponentCreation((elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    Text.create(this.eventLog);
                                    Text.fontSize(14);
                                    Text.fontColor(this.eventLog.includes('成功') ? '#2E7D32' : '#D32F2F');
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
                        Button.createWithLabel('开启新风系统', { type: ButtonType.Capsule });
                        Button.onClick(() => this.sendRequest('send-message-on'));
                        Button.width('80%');
                        Button.height(50);
                        Button.backgroundColor('#2E7D32');
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
                        Button.createWithLabel('关闭新风系统', { type: ButtonType.Capsule });
                        Button.onClick(() => this.sendRequest('send-message-off'));
                        Button.width('80%');
                        Button.height(50);
                        Button.backgroundColor('#D32F2F');
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
export { FanControlPage };
//# sourceMappingURL=FanControlPage.js.map