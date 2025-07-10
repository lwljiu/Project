import http from '@ohos.net.http';

@Component
struct LEDPage {
  @State illumination: string = '--';
  @State unit: string = 'lx';
  @State isLoading: boolean = true;
  @State lastUpdate: string = '从未更新';
  @State errorMessage: string = '';
  @State isRefreshing: boolean = false;
  private timerId: number = 0;
  private httpRequest: http.HttpRequest = http.createHttp();
  private readonly UPDATE_INTERVAL: number = 5000;

  aboutToAppear() {
    this.fetchLEDData();
    this.startAutoRefresh();
  }

  aboutToDisappear() {
    this.stopAutoRefresh();
    this.httpRequest.destroy();
  }

  private startAutoRefresh() {
    this.timerId = setInterval(() => {
      this.fetchLEDData();
    }, this.UPDATE_INTERVAL) as number;
  }

  private stopAutoRefresh() {
    clearInterval(this.timerId);
  }

  private async fetchLEDData(retryCount = 3) {
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
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.GET,
      });

      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());

        if (rawData.length > 0) {
          const data = rawData[0];
          if (data.value.illumination !== undefined) {
            this.illumination = data.value.illumination;
            this.unit = 'lx';
          } else {
            this.handleError('API 数据格式错误');
          }
        } else {
          this.handleError('API 返回数据为空');
        }
      } else {
        this.handleError(`HTTP错误: ${response.responseCode}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error.message);
        setTimeout(() => {
          this.fetchLEDData(retryCount - 1);
        }, 1000);
      } else {
        this.handleError('未知错误');
      }
    } finally {
      this.isLoading = false;
      this.isRefreshing = false;
      this.lastUpdate = this.formatTime(new Date());
    }
  }

  private handleError(message: string) {
    console.error(`LED 数据获取失败: ${message}`);
    this.errorMessage = `错误: ${message}`;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  private onRefresh() {
    this.isRefreshing = true;
    this.fetchLEDData();
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.light_icon'))
          .width(40)
          .height(40)
          .margin({ right: 10 });
        Text('LED亮度监测')
          .fontSize(22)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333');
      }
      .margin({ bottom: 30 });

      // 主卡片
      Column() {
        // 亮度显示卡片
        Stack() {
          Column() {
            // 背景圆形
            Circle({ width: 300, height: 300 })
              .fill('#FFFFFF')
              .shadow({ radius: 15, color: '#E0E0E0', offsetX: 0, offsetY: 5 });

            // 内容
            Column() {
              Text(this.illumination)
                .fontSize(60)
                .fontWeight(FontWeight.Bold)
                .fontColor('#4A4A4A');

              Text(this.unit)
                .fontSize(22)
                .fontColor('#7D7D7D')
                .margin({ top: -10 });
            }
            .position({ x: 0, y: 0 })
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center)
          }
        }
        .width(320)
        .height(320)
        .margin({ bottom: 30 });

        // 状态信息
        Column() {
          if (this.isLoading && !this.isRefreshing) {
            LoadingProgress()
              .color('#4A90E2')
              .width(30)
              .height(30)
              .margin({ bottom: 10 });
          }

          if (this.errorMessage) {
            Row() {
              Text('⚠️')
                .fontSize(16)
                .margin({ right: 5 });
              Text(this.errorMessage)
                .fontSize(14)
                .fontColor('#FF5252');
            }
            .margin({ bottom: 10 });
          }

          Row() {
            Text('⏱')
              .fontSize(14)
              .margin({ right: 5 });
            Text(`最后更新: ${this.lastUpdate}`)
              .fontSize(12)
              .fontColor('#9E9E9E');
          }
        }
        .alignItems(HorizontalAlign.Center)
      }
      .padding(20)
      .borderRadius(15)
      .backgroundColor('#FFFFFF')
      .shadow({ radius: 10, color: '#E0E0E0', offsetX: 0, offsetY: 2 })
      .margin({ bottom: 20 });

      // 刷新按钮
      Button('手动刷新', { type: ButtonType.Capsule })
        .width(150)
        .height(40)
        .backgroundColor('#4A90E2')
        .fontColor('#FFFFFF')
        .onClick(() => this.onRefresh())
        .opacity(this.isLoading ? 0.6 : 1)
        .enabled(!this.isLoading);
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor('#F8F9FA')
    .padding(20);
  }
}

export { LEDPage };