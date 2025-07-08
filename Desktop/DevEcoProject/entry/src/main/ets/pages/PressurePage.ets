import http from '@ohos.net.http';

@Component
struct PressurePage {
  @State pressure: string = '--';
  @State unit: string = 'hPa';
  @State isLoading: boolean = true;
  @State lastUpdate: string = '从未更新';
  @State errorMessage: string = '';
  @State trend: 'up' | 'down' | 'stable' = 'stable';
  private timerId: number = 0;
  private httpRequest: http.HttpRequest = http.createHttp();
  private lastPressureValue: number | null = null;

  // 颜色配置
  private readonly PRIMARY_COLOR: string = '#4A6DA7';
  private readonly ERROR_COLOR: string = '#E74C3C';
  private readonly SUCCESS_COLOR: string = '#2ECC71';
  private readonly CARD_BG_COLOR: string = '#FFFFFF';
  private readonly BG_COLOR: string = '#F8F9FA';
  private readonly TEXT_SECONDARY: string = '#7F8C8D';

  aboutToAppear() {
    this.fetchPressureData();
    this.timerId = setInterval(() => {
      this.fetchPressureData();
    }, 5000) as number;
  }

  aboutToDisappear() {
    clearInterval(this.timerId);
    this.httpRequest.destroy();
  }

  private async fetchPressureData(retryCount: number = 3) {
    if (retryCount <= 0) {
      this.handleError('网络请求失败，重试次数已用尽');
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';

      const url = 'http://192.168.0.169:81/api/data/Pressure';
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.GET,
        connectTimeout: 3000,
        readTimeout: 3000
      });

      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        console.log('Raw Data:', rawData);

        if (rawData.length > 0) {
          const data = rawData[0];
          if (data.value.pressure !== undefined) {
            const currentPressure = parseFloat(data.value.pressure);
            this.updatePressureTrend(currentPressure);
            this.pressure = currentPressure.toFixed(2);
            this.lastPressureValue = currentPressure;
          } else {
            this.handleError('API 数据格式错误');
          }
        } else {
          this.handleError('API 返回数据为空');
        }
      } else {
        this.handleError(`服务器错误: ${response.responseCode}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error.message);
        setTimeout(() => {
          this.fetchPressureData(retryCount - 1);
        }, 1000);
      } else {
        this.handleError('未知错误');
      }
    } finally {
      this.isLoading = false;
      this.lastUpdate = this.formatTime(new Date());
    }
  }

  private updatePressureTrend(currentPressure: number) {
    if (this.lastPressureValue === null) {
      this.trend = 'stable';
      return;
    }

    const diff = currentPressure - this.lastPressureValue;
    if (Math.abs(diff) < 0.5) {
      this.trend = 'stable';
    } else if (diff > 0) {
      this.trend = 'up';
    } else {
      this.trend = 'down';
    }
  }

  private handleError(message: string) {
    console.error(`压强数据获取失败: ${message}`);
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.ic_barometer'))
          .width(32)
          .height(32)
          .margin({ right: 12 })
        Text('压强监测')
          .fontSize(26)
          .fontColor(this.PRIMARY_COLOR)
          .fontWeight(FontWeight.Bold)
      }
      .justifyContent(FlexAlign.Center)
      .margin({ top: 20, bottom: 30 })

      // 主卡片
      Column() {
        // 压强值显示
        Row() {
          Text(this.pressure)
            .fontSize(48)
            .fontColor(this.PRIMARY_COLOR)
            .fontWeight(FontWeight.Bold)

          Column() {
            Text(this.unit)
              .fontSize(18)
              .fontColor(this.PRIMARY_COLOR)

            if (this.trend === 'up') {
              Image($r('app.media.arrow_up'))
                .width(20)
                .height(20)
                .colorFilter(this.ERROR_COLOR)
            } else if (this.trend === 'down') {
              Image($r('app.media.arrow_down'))
                .width(20)
                .height(20)
                .colorFilter(this.SUCCESS_COLOR)
            } else {
              Text('—')
                .fontSize(20)
                .fontColor('#95A5A6')
            }
          }
          .margin({ left: 8, top: 8 })
        }
        .justifyContent(FlexAlign.Center)

        // 分隔线
        Divider()
          .strokeWidth(1)
          .color('#ECF0F1')
          .margin({ top: 15, bottom: 15 })

        // 状态行
        Row() {
          if (this.isLoading) {
            LoadingProgress()
              .width(20)
              .height(20)
              .color(this.PRIMARY_COLOR)
            Text('数据加载中...')
              .fontSize(14)
              .fontColor(this.TEXT_SECONDARY)
              .margin({ left: 10 })
          } else if (this.errorMessage) {
            Image($r('app.media.error_icon'))
              .width(20)
              .height(20)
              .colorFilter(this.ERROR_COLOR)
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor(this.ERROR_COLOR)
              .margin({ left: 10 })
              .maxLines(1)
          } else {
            Image($r('app.media.success'))
              .width(20)
              .height(20)
              .colorFilter(this.SUCCESS_COLOR)
            Text(`更新于 ${this.lastUpdate}`)
              .fontSize(14)
              .fontColor(this.TEXT_SECONDARY)
              .margin({ left: 10 })
          }
        }
        .justifyContent(FlexAlign.Center)
      }
      .width('90%')
      .padding(20)
      .backgroundColor(this.CARD_BG_COLOR)
      .borderRadius(15)
      .shadow({ radius: 8, color: '#00000010', offsetX: 0, offsetY: 4 })

      // 刷新按钮
      Button('手动刷新')
        .width(160)
        .height(40)
        .margin({ top: 30 })
        .backgroundColor(this.PRIMARY_COLOR)
        .fontColor('#FFFFFF')
        .onClick(() => {
          this.fetchPressureData()
        })
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(this.BG_COLOR)
  }
}

export { PressurePage };