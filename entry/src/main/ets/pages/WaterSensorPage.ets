import http from '@ohos.net.http';

@Component
struct WaterSensorPage {
  @State status: string = '--';
  @State isLoading: boolean = true;
  @State lastUpdate: string = '从未更新';
  @State errorMessage: string = '';
  @State warningLevel: number = 0; // 0:正常 1:警告
  private timerId: number = 0;
  private httpRequest: http.HttpRequest = http.createHttp();

  private readonly UPDATE_INTERVAL: number = 5000;

  aboutToAppear() {
    this.fetchWaterData();
    this.timerId = setInterval(() => {
      this.fetchWaterData();
    }, this.UPDATE_INTERVAL) as number;
  }

  aboutToDisappear() {
    clearInterval(this.timerId);
    this.httpRequest.destroy();
  }

  private async fetchWaterData(retryCount = 3) {
    if (retryCount <= 0) {
      this.handleError('网络请求失败，重试次数已用尽');
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.warningLevel = 0;

      const url = 'http://192.168.0.169:81/api/data/watersensor';
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.GET,
      });

      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        console.log('Raw Data:', rawData);

        if (rawData.length > 0) {
          const data = rawData[0];
          if (data.value.status !== undefined) {
            const isWet = data.value.status === 'wet';
            this.status = isWet ? '检测到水浸' : '正常';
            this.warningLevel = isWet ? 1 : 0;
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
          this.fetchWaterData(retryCount - 1);
        }, 1000);
      } else {
        this.handleError('未知错误');
      }
    } finally {
      this.isLoading = false;
      this.lastUpdate = this.formatTime(new Date());
    }
  }

  private handleError(message: string) {
    console.error(`水浸数据获取失败: ${message}`);
    this.errorMessage = `错误: ${message}`;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.water'))
          .width(40)
          .height(40)
          .margin({ right: 10 });

        Text('水浸传感器监测')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#333333');
      }
      .margin({ bottom: 30 });

      // 主显示区域
      Stack() {
        // 背景圆形
        Circle({ width: 220, height: 220 })
          .fill(this.getCircleColor())
          .opacity(0.1);

        // 主状态
        Column() {
          Text(this.status)
            .fontSize(36)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.getTextColor());

          Text(this.warningLevel === 1 ? '警告' : '正常')
            .fontSize(24)
            .fontColor('#666666')
            .margin({ top: 10 });
        }
      }
      .margin({ bottom: 30 });

      // 状态指示器
      Row() {
        Text(this.getStatusText())
          .fontSize(16)
          .fontColor(this.getTextColor())
          .padding(8)
          .backgroundColor(this.getStatusBgColor())
          .borderRadius(20);
      }
      .margin({ bottom: 20 });

      // 数据更新时间
      Row() {
        Image($r('app.media.clock_icon'))
          .width(16)
          .height(16)
          .margin({ right: 5 });

        Text(`最后更新: ${this.lastUpdate}`)
          .fontSize(14)
          .fontColor('#888888');
      }

      // 加载或错误状态
      if (this.isLoading) {
        LoadingProgress()
          .color('#007AFF')
          .width(50)
          .height(50)
          .margin({ top: 20 });
      } else if (this.errorMessage) {
        Row() {
          Image($r('app.media.error_icon'))
            .width(16)
            .height(16)
            .margin({ right: 5 });

          Text(this.errorMessage)
            .fontSize(14)
            .fontColor('#FF3B30');
        }
        .margin({ top: 20 });
      }

      // 信息卡片
      Column() {
        Text('水浸传感器说明')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')
          .margin({ bottom: 10 });

        Text('检测地面或设备是否进水')
          .fontSize(14)
          .fontColor('#666666')
          .margin({ bottom: 5 });

        Text('状态: ' + (this.warningLevel === 1 ? '检测到水浸' : '未检测到水'))
          .fontSize(14)
          .fontColor(this.warningLevel === 1 ? '#FF3B30' : '#34C759');
      }
      .width('90%')
      .padding(15)
      .margin({ top: 30 })
      .backgroundColor('#FFFFFF')
      .borderRadius(12)
      .shadow({ radius: 6, color: '#20000000', offsetX: 0, offsetY: 2 });
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding(20)
    .backgroundColor('#F8F8F8');
  }

  private getStatusText(): string {
    return this.warningLevel === 1 ? '警告: 检测到水浸，请立即处理！' : '状态正常';
  }

  private getCircleColor(): string {
    return this.warningLevel === 1 ? '#FF3B30' : '#34C759';
  }

  private getTextColor(): string {
    return this.warningLevel === 1 ? '#FF3B30' : '#333333';
  }

  private getStatusBgColor(): string {
    return this.warningLevel === 1 ? '#FFEBE6' : '#E8F5E9';
  }
}

export { WaterSensorPage };