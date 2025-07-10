import http from '@ohos.net.http';

@Component
struct CO2Page {
  @State co2: string = '--';
  @State unit: string = 'ppm';
  @State isLoading: boolean = true;
  @State lastUpdate: string = '从未更新';
  @State errorMessage: string = '';
  @State warningLevel: number = 0; // 0:正常 1:警告 2:危险
  private timerId: number = 0;
  private httpRequest: http.HttpRequest = http.createHttp();

  private readonly UPDATE_INTERVAL: number = 5000; // 5秒更新一次

  aboutToAppear() {
    this.fetchCO2Data();
    this.timerId = setInterval(() => {
      this.fetchCO2Data();
    }, this.UPDATE_INTERVAL) as number;
  }

  aboutToDisappear() {
    clearInterval(this.timerId);
    this.httpRequest.destroy();
  }

  private async fetchCO2Data(retryCount = 3) {
    if (retryCount <= 0) {
      this.handleError('网络请求失败，重试次数已用尽');
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      this.warningLevel = 0;

      const url = 'http://192.168.0.169:81/api/data/CO2';
      const response: http.HttpResponse = await this.httpRequest.request(url, {
        method: http.RequestMethod.GET,
      });

      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        console.log('Raw Data:', rawData);

        if (rawData.length > 0) {
          const data = rawData[0];
          if (data.value.dioxide !== undefined) {
            const co2Value = parseFloat(data.value.dioxide);
            this.co2 = co2Value.toFixed(0);

            // 设置警告级别
            if (co2Value < 400 || co2Value > 1000) {
              this.warningLevel = co2Value > 1500 ? 2 : 1;
            }
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
          this.fetchCO2Data(retryCount - 1);
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
    console.error(`CO₂ 数据获取失败: ${message}`);
    this.errorMessage = `错误: ${message}`;
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
        Image($r('app.media.co2_icon')) // 添加CO₂图标
          .width(40)
          .height(40)
          .margin({ right: 10 });

        Text('二氧化碳浓度监测')
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

        // 主数值
        Column() {
          Text(this.co2)
            .fontSize(60)
            .fontWeight(FontWeight.Bold)
            .fontColor(this.getTextColor());

          Text(this.unit)
            .fontSize(24)
            .fontColor('#666666')
            .margin({ top: -10 });
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
        Image($r('app.media.clock_icon')) // 时钟图标
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
          Image($r('app.media.error_icon')) // 错误图标
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
        Text('CO₂浓度参考值')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#333333')
          .margin({ bottom: 10 });

        Row() {
          Column() {
            Text('400-1000 ppm')
              .fontSize(14)
              .fontColor('#34C759');
            Text('正常范围')
              .fontSize(12)
              .fontColor('#888888');
          }
          .margin({ right: 20 });

          Column() {
            Text('1000-1500 ppm')
              .fontSize(14)
              .fontColor('#FF9500');
            Text('警告')
              .fontSize(12)
              .fontColor('#888888');
          }
          .margin({ right: 20 });

          Column() {
            Text('>1500 ppm')
              .fontSize(14)
              .fontColor('#FF3B30');
            Text('危险')
              .fontSize(12)
              .fontColor('#888888');
          }
        }
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

  // 获取状态文本
  private getStatusText(): string {
    switch (this.warningLevel) {
      case 1: return '警告: CO₂浓度偏高';
      case 2: return '危险: CO₂浓度过高';
      default: return 'CO₂浓度正常';
    }
  }

  // 获取圆形颜色
  private getCircleColor(): string {
    switch (this.warningLevel) {
      case 1: return '#FF9500'; // 橙色
      case 2: return '#FF3B30'; // 红色
      default: return '#34C759'; // 绿色
    }
  }

  // 获取文本颜色
  private getTextColor(): string {
    switch (this.warningLevel) {
      case 1: return '#FF9500'; // 橙色
      case 2: return '#FF3B30'; // 红色
      default: return '#333333'; // 黑色
    }
  }

  // 获取状态背景色
  private getStatusBgColor(): string {
    switch (this.warningLevel) {
      case 1: return '#FFF4E5';
      case 2: return '#FFEBE6';
      default: return '#E8F5E9';
    }
  }
}

export { CO2Page };