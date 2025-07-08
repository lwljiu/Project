import http from '@ohos.net.http';

@Component
struct WeatherPage {
  @State temp: string = '--';
  @State tempUnit: string = '℃';
  @State humidity: string = '--';
  @State humidityUnit: string = '%';
  @State isLoading: boolean = true;
  @State lastUpdate: string = '从未更新';
  @State errorMessage: string = '';
  @State warningLevel: number = 0;
  @State comfortLevel: string = '舒适';

  private timerId: number = 0;
  private httpRequest: http.HttpRequest = http.createHttp();
  private readonly UPDATE_INTERVAL: number = 5000;

  aboutToAppear() {
    this.fetchWeatherData();
    this.timerId = setInterval(() => {
      this.fetchWeatherData();
    }, this.UPDATE_INTERVAL) as number;
  }

  aboutToDisappear() {
    clearInterval(this.timerId);
    this.httpRequest.destroy();
  }

  private async fetchWeatherData(retryCount = 3) {
    if (retryCount <= 0) {
      this.handleError('网络请求失败，重试次数已用尽');
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.warningLevel = 0;

      const url = 'http://192.168.0.169:81/api/data/Weather';
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.GET,
      });

      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        if (rawData.length > 0) {
          const data = rawData[0];
          if (data.value.temp !== undefined && data.value.humi !== undefined) {
            const tempValue = parseFloat(data.value.temp);
            const humiValue = parseFloat(data.value.humi);

            this.temp = tempValue.toFixed(1);
            this.humidity = humiValue.toFixed(1);
            this.evaluateComfortLevel(tempValue, humiValue);
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
          this.fetchWeatherData(retryCount - 1);
        }, 1000);
      } else {
        this.handleError('未知错误');
      }
    } finally {
      this.isLoading = false;
      this.lastUpdate = this.formatTime(new Date());
    }
  }

  private evaluateComfortLevel(temp: number, humidity: number) {
    if (temp > 30) {
      this.warningLevel = 2;
      this.comfortLevel = '酷热';
    } else if (temp > 28) {
      this.warningLevel = 1;
      this.comfortLevel = '炎热';
    } else if (temp > 24) {
      this.warningLevel = 0;
      this.comfortLevel = '温暖';
    } else if (temp > 18) {
      this.warningLevel = 0;
      this.comfortLevel = '舒适';
    } else if (temp > 10) {
      this.warningLevel = 0;
      this.comfortLevel = '凉爽';
    } else {
      this.warningLevel = 1;
      this.comfortLevel = '寒冷';
    }

    if (humidity > 80) {
      this.warningLevel = Math.max(this.warningLevel, 1);
      this.comfortLevel += ' (潮湿)';
    } else if (humidity < 30) {
      this.warningLevel = Math.max(this.warningLevel, 1);
      this.comfortLevel += ' (干燥)';
    }
  }

  private handleError(message: string) {
    console.error(`天气数据获取失败: ${message}`);
    this.errorMessage = `错误: ${message}`;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private formatTime(date: Date): string {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
  }

  private getStatusColor(): string {
    switch (this.warningLevel) {
      case 1: return '#FFA500'; // warning - 橙色
      case 2: return '#FF4500'; // danger - 红色
      default: return '#32CD32'; // safe - 绿色
    }
  }

  private getComfortSuggestion(): string {
    switch (this.comfortLevel.split(' ')[0]) {
      case '酷热': return '建议开启空调，保持通风，多补充水分';
      case '炎热': return '建议开启风扇，穿着轻薄衣物';
      case '温暖': return '适宜穿着短袖，注意防晒';
      case '舒适': return '理想的室内环境，保持当前状态';
      case '凉爽': return '适宜穿着长袖，注意保暖';
      case '寒冷': return '建议开启暖气，穿着保暖衣物';
      default: return '当前环境舒适度良好';
    }
  }

  build() {
    Column() {
      // 顶部标题栏
      Row() {
        Image($r('app.media.weather_icon'))
          .width(28)
          .height(28)
          .margin({ right: 8 });
        Text('温湿度监测')
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#2C3E50');
      }
      .margin({ bottom: 24 });

      // 两个圆圈显示温湿度
      Row({ space: 20 }) {
        // 温度圆
        Stack() {
          Circle({ width: 180, height: 180 })
            .fill('#FF8C00')
            .opacity(0.1);

          Column({ space: 4 }) {
            Text(`${this.temp}${this.tempUnit}`)
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor('#FF8C00');
            Text('温度')
              .fontSize(14)
              .fontColor('#666666');
          }
        }

        // 湿度圆
        Stack() {
          Circle({ width: 180, height: 180 })
            .fill('#00BFFF')
            .opacity(0.1);

          Column({ space: 4 }) {
            Text(`${this.humidity}${this.humidityUnit}`)
              .fontSize(32)
              .fontWeight(FontWeight.Bold)
              .fontColor('#00BFFF');
            Text('湿度')
              .fontSize(14)
              .fontColor('#666666');
          }
        }
      }
      .margin({ bottom: 20 })
      .alignItems(VerticalAlign.Center)

      // 舒适度显示
      Text(this.comfortLevel)
        .fontSize(18)
        .fontWeight(FontWeight.Medium)
        .fontColor(this.getStatusColor())
        .padding({ left: 12, right: 12, top: 6, bottom: 6 })
        .backgroundColor('#FFFFFF')
        .borderRadius(16)
        .shadow({ radius: 2, color: '#22000000' })
        .margin({ bottom: 12 });

      // 状态信息区域
      Column() {
        if (this.isLoading) {
          Row() {
            LoadingProgress()
              .color('#1E90FF')
              .width(24)
              .height(24)
              .margin({ right: 8 });
            Text('加载中...')
              .fontSize(14)
              .fontColor('#1E90FF');
          }
        } else if (this.errorMessage) {
          Row() {
            Image($r('app.media.error_icon'))
              .width(16)
              .height(16)
              .margin({ right: 6 });
            Text(this.errorMessage)
              .fontSize(14)
              .fontColor('#FF0000');
          }
        } else {
          Row() {
            Image($r('app.media.clock_icon'))
              .width(16)
              .height(16)
              .margin({ right: 6 });
            Text(`最后更新: ${this.lastUpdate}`)
              .fontSize(14)
              .fontColor('#666666');
          }
        }
      }
      .margin({ top: 8 });

      // 舒适度建议卡片
      Column() {
        Text('舒适度建议')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .margin({ bottom: 8 });

        Text(this.getComfortSuggestion())
          .fontSize(14)
          .fontColor('#555555')
          .textAlign(TextAlign.Center)
          .lineHeight(22);
      }
      .width('90%')
      .padding(18)
      .margin({ top: 24 })
      .backgroundColor('#FFFFFF')
      .borderRadius(14)
      .shadow({ radius: 6, color: '#18000000' });
    }
    .width('100%')
    .height('100%')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .padding(20)
    .backgroundColor('#F2F6FA');
  }
}

export { WeatherPage };
