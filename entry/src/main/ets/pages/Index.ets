import { CO2Page } from "./CO2Page";
import { WeatherPage } from "./WeatherPage";
import { PressurePage } from "./PressurePage";
import { FanControlPage } from "./FanControlPage";
import { AlarmControlPage } from "./AlarmControlPage";
import { DeepSeekPage } from "./DeepSeekPage";
import { LEDPage } from "./LEDPage";
import { InfraredPage } from "./InfraredPage";
import { WaterSensorPage } from "./WaterSensorPage";

@Entry
@Component
struct Index {
  @State currentPage: string = 'home';
  @State isEnvironmentMenuOpen: boolean = false;
  @State subPage: string = '';
  @State private sidebarCollapsed: boolean = false;

  // 页面配置数据
  private readonly pageConfig = {
    environment: {
      title: '环境监测',
      icon: $r('app.media.environment_icon'),
      subPages: [
        { id: 'temperature', name: '温湿度监测', icon: $r('app.media.temperature_icon'), color: '#87CEFA' },
        { id: 'co2', name: 'CO2监测', icon: $r('app.media.co2_icon'), color: '#98FB98' },
        { id: 'pressure', name: '压强监测', icon: $r('app.media.pressure_icon'), color: '#FFA07A' },
        { id: 'light', name: '光照监测', icon: $r('app.media.light_icon'), color: '#FFD700' },
        { id: 'infrared', name: '红外检测', icon: $r('app.media.red'), color: '#BA68C8' },
        { id: 'watersensor', name: '水浸检测', icon: $r('app.media.water'), color: '#4FC3F7' }
      ]
    },
    mainPages: [
      { id: 'fan', name: '智能新风', icon: $r('app.media.fan_icon'), color: '#FF6347' },
      { id: 'alarm', name: '安防管理', icon: $r('app.media.alarm_icon'), color: '#FF4500' },
      { id: 'deepseek', name: 'AI智能分析', icon: $r('app.media.ai_icon'), color: '#4CAF50' }
    ]
  };

  // 处理页面导航
  private handleNavigation(page: string) {
    this.currentPage = page;
    this.subPage = '';
    this.isEnvironmentMenuOpen = false;
  }

  // 处理子页面导航
  private handleSubNavigation(subPage: string) {
    this.subPage = subPage;
  }

  // 切换环境菜单
  private toggleEnvironmentMenu() {
    this.isEnvironmentMenuOpen = !this.isEnvironmentMenuOpen;
    if (!this.isEnvironmentMenuOpen) {
      this.subPage = '';
    }
  }

  // 返回首页
  private goHome() {
    this.currentPage = 'home';
    this.isEnvironmentMenuOpen = false;
    this.subPage = '';
  }

  // 切换侧边栏状态
  private toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  // 菜单按钮构建器
  @Builder
  private MenuButton(text: string, icon: Resource, isActive: boolean, bgColor: string, onClick: () => void) {
    Button() {
      Row() {
        Image(icon)
          .width(24)
          .height(24)
          .margin({ right: this.sidebarCollapsed ? 0 : 8 })
          .opacity(this.sidebarCollapsed ? 0.9 : 1);
        if (!this.sidebarCollapsed) {
          Text(text)
            .fontSize(16)
            .fontColor(isActive ? '#FFFFFF' : '#333333');
        }
      }
      .justifyContent(FlexAlign.Center)
      .width('100%')
    }
    .onClick(onClick)
    .width(this.sidebarCollapsed ? 50 : '90%')
    .height(50)
    .type(ButtonType.Capsule)
    .backgroundColor(isActive ? bgColor : '#F5F5F5')
    .borderRadius(25)
    .stateEffect(isActive || !this.sidebarCollapsed)
    .shadow(isActive ? { radius: 4, color: '#40000000', offsetX: 0, offsetY: 2 } : null)
    .margin({ bottom: 10 });
  }

  build() {
    Row() {
      // 左侧导航栏
      Column({ space: 10 }) {
        // 顶部应用标题和折叠按钮
        Row() {
          if (!this.sidebarCollapsed) {
            Image($r('app.media.app_logo'))
              .width(40)
              .height(40)
              .margin({ right: 10 });
            Text('智能控制中心')
              .fontSize(18)
              .fontWeight(FontWeight.Bold)
              .fontColor('#333333');
          }
          Button() {
            Text(this.sidebarCollapsed ? "→" : "←")
              .fontSize(20)
              .fontColor('#333333')
          }
          .onClick(() => this.toggleSidebar())
          .type(ButtonType.Circle)
          .width(40)
          .height(40)
          .backgroundColor(Color.Transparent)
          .position({ x: this.sidebarCollapsed ? 0 : '80%' })
        }
        .width('100%')
        .justifyContent(FlexAlign.Start)
        .margin({ bottom: 30 });

        // 环境监测按钮
        this.MenuButton(
          this.pageConfig.environment.title,
          this.pageConfig.environment.icon,
          this.isEnvironmentMenuOpen || this.subPage !== '',
          '#FFCC99',
          () => this.toggleEnvironmentMenu()
        );

        // 环境监测子菜单
        if (this.isEnvironmentMenuOpen || this.subPage) {
          Column({ space: 5 }) {
            ForEach(this.pageConfig.environment.subPages, (item) => {
              this.MenuButton(
                item.name,
                item.icon,
                this.subPage === item.id,
                item.color,
                () => this.handleSubNavigation(item.id)
              );
            });

            // 返回主界面按钮
            this.MenuButton(
              '返回主界面',
              $r('app.media.home_icon'),
              false,
              '#FFCC99',
              () => this.goHome()
            );
          }
          .padding({ left: this.sidebarCollapsed ? 0 : 10 });
        }

        // 主菜单按钮
        if (!this.isEnvironmentMenuOpen && !this.subPage) {
          Column({ space: 5 }) {
            ForEach(this.pageConfig.mainPages, (item) => {
              this.MenuButton(
                item.name,
                item.icon,
                this.currentPage === item.id,
                item.color,
                () => this.handleNavigation(item.id)
              );
            });
          }
        }
      }
      .width(this.sidebarCollapsed ? 80 : '25%')
      .padding(15)
      .backgroundColor('#FFFFFF')
      .borderRadius(15)
      .shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 2 })
      .animation({ duration: 300, curve: Curve.EaseOut });

      // 右侧内容区
      Column() {
        // 顶部状态栏
        Row() {
          Text(this.getCurrentPageTitle())
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#333333');
        }
        .width('100%')
        .padding({ bottom: 15 });

        // 页面内容区
        Column() {
          if (this.subPage === 'temperature') {
            WeatherPage();
          } else if (this.subPage === 'co2') {
            CO2Page();
          } else if (this.subPage === 'pressure') {
            PressurePage();
          } else if (this.subPage === 'light') {
            LEDPage();
          } else if (this.subPage === 'infrared') {
            InfraredPage();
          } else if (this.subPage === 'watersensor') {
            WaterSensorPage();
          } else if (this.currentPage === 'fan') {
            FanControlPage();
          } else if (this.currentPage === 'alarm') {
            AlarmControlPage();
          } else if (this.currentPage === 'deepseek') {
            DeepSeekPage();
          } else {
            // 默认首页内容
            Column() {
              Image($r('app.media.smart_home_banner'))
                .width('100%')
                .height(200)
                .objectFit(ImageFit.Cover)
                .borderRadius(15)
                .margin({ bottom: 20 });

              Text('欢迎使用智能控制中心')
                .fontSize(24)
                .fontWeight(FontWeight.Bold)
                .margin({ bottom: 10 });

              Text('请从左侧菜单选择功能')
                .fontSize(16)
                .fontColor('#666666');
            }
            .width('100%')
            .height('100%')
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center);
          }
        }
        .width('100%')
        .height('100%')
        .backgroundColor("#FFFFFF")
        .borderRadius(15)
        .shadow({ radius: 8, color: '#10000000', offsetX: 0, offsetY: 2 })
        .padding(20);
      }
      .width(this.sidebarCollapsed ? '85%' : '75%')
      .padding(15)
      .animation({ duration: 300, curve: Curve.EaseOut });
    }
    .height('100%')
    .width('100%')
    .backgroundColor('#F5F7FA');
  }

  // 获取当前页面标题
  private getCurrentPageTitle(): string {
    if (this.subPage === 'temperature') return '温湿度监测';
    if (this.subPage === 'co2') return '二氧化碳监测';
    if (this.subPage === 'pressure') return '压强监测';
    if (this.subPage === 'light') return '光照监测';
    if (this.subPage === 'infrared') return '红外检测计数';
    if (this.subPage === 'watersensor') return '水浸传感器监测';
    if (this.currentPage === 'fan') return '智能新风管理';
    if (this.currentPage === 'alarm') return '安防管理';
    if (this.currentPage === 'deepseek') return 'AI智能分析';
    return '控制中心';
  }
}

export { Index };