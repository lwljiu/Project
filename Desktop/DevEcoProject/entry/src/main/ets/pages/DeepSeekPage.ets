import http from '@ohos.net.http';
import prompt from '@ohos.prompt';


@Component
struct DeepSeekPage {
  @State inputText: string = '';
  @State messages: Array<{ role: string, content: string }> = [];
  @State isLoading: boolean = false;
  private apiKey: string = 'sk-8e4ef725a77b44bebbe85edede82fd02';
  private httpRequest: http.HttpRequest = http.createHttp();

  // 消息项构建器
  @Builder
  MessageItem(msg: { role: string, content: string }) {
    Column() {
      Text(msg.content)
        .fontSize(16)
        .padding(10)
        .borderRadius(8)
        .width('80%')
        .backgroundColor(msg.role === 'user' ? '#E3F2FD' : '#F5F5F5')
        .align(msg.role === 'user' ? Alignment.End : Alignment.Start)
    }
    .width('100%')
    .margin({ bottom: 12 })
  }

  build() {
    Column() {
      // 消息列表区域
      List({ space: 10 }) {
        ForEach(this.messages, (msg, index) => {
          ListItem() {
            this.MessageItem(msg)
          }
          .margin({ left: 10, right: 10 })
        }, (msg, index) => index.toString())
      }
      .layoutWeight(1)
      .width('100%')
      .divider({ strokeWidth: 1, color: '#EEEEEE' })

      // 输入区域
      Row({ space: 10 }) {
        TextInput({ text: this.inputText, placeholder: '输入问题...' })
          .onChange((value: string) => {
            this.inputText = value;
          })
          .height(48)
          .layoutWeight(1)
          .padding({ left: 16, right: 16 })
          .fontSize(16)
          .borderRadius(24)
          .backgroundColor('#FFFFFF')
          .border({ width: 1, color: '#E0E0E0' })

        Button(this.isLoading ? '加载中...' : '发送')
          .onClick(() => {
            if (this.inputText.trim().length > 0 && !this.isLoading) {
              this.sendToDeepseek(this.inputText.trim());
              this.inputText = '';
            }
          })
          .width(80)
          .height(48)
          .type(ButtonType.Capsule)
          .backgroundColor('#2196F3')
          .fontColor(Color.White)
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FAFAFA')
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }

  // DeepSeek API请求方法
  private async sendToDeepseek(question: string) {
    try {
      this.isLoading = true;
      this.messages = [...this.messages, { role: 'user', content: question }];

      const requestUrl = 'https://api.deepseek.com/v1/chat/completions';

      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.apiKey}`
      };

      const currentData = await this.getCurrentData();
      const requestBody = {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: `你是一个专业的环境监测分析助手，以下是当前数据集：${currentData}。请基于这些数据提供分析和建议。` },
          ...this.messages
        ]
      };

      this.httpRequest.request(
        requestUrl,
        {
          method: http.RequestMethod.POST,
          header: headers,
          extraData: JSON.stringify(requestBody)
        }
      ).then((response) => {
        this.isLoading = false;
        if (response.responseCode === 200) {
          const result = JSON.parse(response.result as string);
          if (result.choices?.[0]?.message?.content) {
            this.messages = [...this.messages, {
              role: 'assistant',
              content: result.choices[0].message.content
            }];
          }
        } else {
          console.error("DeepSeek API Error:", response); // 打印完整响应
          prompt.showToast({
            message: `请求失败: ${response.responseCode} - ${response.result}`,
            duration: 3000
          });
        }
      }).catch((err) => {
        this.isLoading = false;
        console.error("DeepSeek Network Error:", err); // 打印完整错误
        prompt.showToast({
          message: `网络错误: ${err.code || err.message}`,
          duration: 3000
        });
      });
    } catch (error) {
      this.isLoading = false;
      console.error("DeepSeek Exception:", error);
      prompt.showToast({
        message: `发生错误: ${error.message}`,
        duration: 3000
      });
    }
  }

  // 获取当前页面的数据集
  private async getCurrentData() {
    try {
      // 使用await等待所有异步数据
      const [temperatureData, co2Data, pressureData] = await Promise.all([
        this.fetchTemperatureData(),
        this.fetchCO2Data(),
        this.fetchPressureData(),
      ]);

      return `温湿度数据: ${temperatureData}, CO2浓度: ${co2Data}, 压强: ${pressureData}`;
    } catch (error) {
      console.error('获取数据集失败:', error);
      return '无法获取数据集，请检查网络连接或API链接';
    }
  }

  // 从API获取温湿度数据
  private async fetchTemperatureData() {
    try {
      const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/Weather', {
        method: http.RequestMethod.GET,
      })
      ;
      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        if (rawData.length > 0 && rawData[0].value.temp !== undefined && rawData[0].value.humi !== undefined) {
          return `${rawData[0].value.temp}°C, 湿度: ${rawData[0].value.humi}%`;
        }
      }
      return '数据获取失败';
    } catch (error) {
      console.error('获取温湿度数据失败:', error);
      return '数据获取失败';
    }
  }

  // 从API获取CO2数据
  private async fetchCO2Data() {
    try {
      const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/CO2', {
        method: http.RequestMethod.GET,
      })
      ;
      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        if (rawData.length > 0 && rawData[0].value.dioxide !== undefined) {
          return `${rawData[0].value.dioxide}ppm`;
        }
      }
      return '数据获取失败';
    } catch (error) {
      console.error('获取CO2数据失败:', error);
      return '数据获取失败';
    }
  }

  // 从API获取压强数据
  private async fetchPressureData() {
    try {
      const response = await this.httpRequest.request('http://192.168.0.169:81/api/data/Pressure', {
        method: http.RequestMethod.GET,
      })
      ;
      if (response.responseCode === 200) {
        const rawData = JSON.parse(response.result.toString());
        if (rawData.length > 0 && rawData[0].value.pressure !== undefined) {
          return `${rawData[0].value.pressure}hPa`;
        }
      }
      return '数据获取失败';
    } catch (error) {
      console.error('获取压强数据失败:', error);
      return '数据获取失败';
    }
  }
}

export { DeepSeekPage };