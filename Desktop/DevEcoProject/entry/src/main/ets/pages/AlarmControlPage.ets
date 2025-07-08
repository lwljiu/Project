import http from '@ohos.net.http';

@Component
struct AlarmControlPage {
  @State isLoading: boolean = false;
  @State eventLog: string = '';
  private httpRequest: http.HttpRequest = http.createHttp();

  aboutToDisappear() {
    this.httpRequest.destroy();
  }

  private async sendRequest(action: string) {
    try {
      this.isLoading = true;
      this.eventLog = '';

      const url = `http://192.168.0.169:9001/${action}`;
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.POST,
      });

      if (response.responseCode === 200) {
        this.eventLog = `${action.slice(11).replace('-', ' ')}成功`;
      } else {
        this.eventLog = `请求失败: HTTP错误 ${response.responseCode}`;
      }
    } catch (error) {
      this.eventLog = `请求失败: ${error instanceof Error ? error.message : '未知错误'}`;
    } finally {
      this.isLoading = false;
    }
  }

  build() {
    Column() {
      // 顶部标题
      Text('安防管理系统')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 30, bottom: 20 })
        .fontColor('#333333');

      // 主内容区域卡片
      Column() {
        if (this.isLoading) {
          // 加载状态
          Column() {
            LoadingProgress()
              .width(50)
              .height(50)
              .color('#4CAF50')
              .margin({ bottom: 20 });
            Text('正在发送请求...')
              .fontSize(16)
              .fontColor('#666666');
          }
          .width('100%')
          .height(200)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else {
          Column({ space: 20 }) {
            // 信息卡片
            Column() {
              Text('系统说明')
                .fontSize(18)
                .fontWeight(FontWeight.Medium)
                .fontColor('#4CAF50')
                .margin({ bottom: 10 });

              Text('当二氧化碳浓度超出设定值320ppm时，安防管理可以启动，也可以手动控制安防系统的状态。')
                .fontSize(14)
                .fontColor('#666666')
                .textAlign(TextAlign.Center);
            }
            .width('90%')
            .padding(15)
            .borderRadius(12)
            .backgroundColor('#FFFFFF')
            .shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 4 })

            // 状态显示区域
            if (this.eventLog) {
              Column() {
                Text(this.eventLog.includes('成功') ? '操作成功' : '操作失败')
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .margin({ bottom: 5 });

                Text(this.eventLog)
                  .fontSize(14)
                  .fontColor(this.eventLog.includes('成功') ? '#4CAF50' : '#FF5252');
              }
              .width('90%')
              .padding(15)
              .borderRadius(12)
              .backgroundColor('#FFFFFF')
              .border({
                width: 1,
                color: this.eventLog.includes('成功') ? '#E8F5E9' : '#FFEBEE'
              })
              .shadow({ radius: 4, color: '#10000000', offsetX: 0, offsetY: 2 })
            }

            // 按钮区域
            Column({ space: 15 }) {
              Button('启动安防管理', { type: ButtonType.Capsule })
                .onClick(() => this.sendRequest('send-message-on'))
                .width('80%')
                .height(50)
                .backgroundColor('#4CAF50')
                .fontColor('#FFFFFF')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .stateEffect(true);

              Button('停止安防管理', { type: ButtonType.Capsule })
                .onClick(() => this.sendRequest('send-message-off'))
                .width('80%')
                .height(50)
                .backgroundColor('#FF5252')
                .fontColor('#FFFFFF')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .stateEffect(true);
            }
            .width('100%')
            .margin({ top: 20 })
          }
          .width('100%')
        }
      }
      .width('90%')
      .padding(20)
      .borderRadius(16)
      .backgroundColor('#FAFAFA')
      .shadow({ radius: 12, color: '#20000000', offsetX: 0, offsetY: 6 })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Start)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor('#F5F5F5');
  }
}

export { AlarmControlPage };