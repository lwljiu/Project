import http from '@ohos.net.http';

@Component
struct FanControlPage {
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

      const url = `http://192.168.0.169:9000/${action}`;
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
      Text('智能新风控制系统')
        .fontSize(24)
        .fontWeight(FontWeight.Bold)
        .margin({ top: 30, bottom: 20 })
        .fontColor('#2E7D32');

      // 主内容区域卡片
      Column() {
        if (this.isLoading) {
          // 加载状态
          Column() {
            LoadingProgress()
              .width(50)
              .height(50)
              .color('#2E7D32')
              .margin({ bottom: 20 });
            Text('正在连接设备...')
              .fontSize(16)
              .fontColor('#616161');
          }
          .width('100%')
          .height(200)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        } else {
          Column({ space: 20 }) {
            // 信息卡片
            Column() {
              Text('温度监测')
                .fontSize(18)
                .fontWeight(FontWeight.Medium)
                .fontColor('#2E7D32')
                .margin({ bottom: 10 });

              Row() {
                Image($r('app.media.thermometer')) // 温度计图标
                  .width(24)
                  .height(24)
                  .margin({ right: 10 });

                Text('(设定阈值: 20°C)')
                  .fontSize(14)
                  .fontColor('#424242');
              }
              .margin({ bottom: 8 })

              Text('当温度超过20°C时，系统可启动新风管理')
                .fontSize(14)
                .fontColor('#616161')
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
                Row() {
                  Image(this.eventLog.includes('成功') ? $r('app.media.success') : $r('app.media.error_icon'))
                    .width(20)
                    .height(20)
                    .margin({ right: 8 });

                  Text(this.eventLog.includes('成功') ? '操作成功' : '操作失败')
                    .fontSize(16)
                    .fontWeight(FontWeight.Medium);
                }
                .margin({ bottom: 5 });

                Text(this.eventLog)
                  .fontSize(14)
                  .fontColor(this.eventLog.includes('成功') ? '#2E7D32' : '#D32F2F');
              }
              .width('90%')
              .padding(15)
              .borderRadius(12)
              .backgroundColor('#FFFFFF')
              .border({
                width: 1,
                color: this.eventLog.includes('成功') ? '#C8E6C9' : '#FFCDD2'
              })
              .shadow({ radius: 4, color: '#10000000', offsetX: 0, offsetY: 2 })
            }

            // 按钮区域
            Column({ space: 15 }) {
              Button('开启新风系统', { type: ButtonType.Capsule })
                .onClick(() => this.sendRequest('send-message-on'))
                .width('80%')
                .height(50)
                .backgroundColor('#2E7D32')
                .fontColor('#FFFFFF')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .stateEffect(true);

              Button('关闭新风系统', { type: ButtonType.Capsule })
                .onClick(() => this.sendRequest('send-message-off'))
                .width('80%')
                .height(50)
                .backgroundColor('#D32F2F')
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

export { FanControlPage };