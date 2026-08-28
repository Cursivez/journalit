<div align="center">

<img
  src="https://github.com/user-attachments/assets/ab7232d4-1352-4658-a284-86029c0246f1"
  alt="Journalit"
  width="420"
  style="max-width: 100%; height: auto;"
/>

Nhật ký giao dịch ưu tiên lưu trữ cục bộ cho Obsidian.

[![Obsidian Plugin](https://img.shields.io/badge/Obsidian-Plugin-purple?style=flat-square&logo=obsidian)](https://obsidian.md/)
[![Docs](https://img.shields.io/badge/docs-journalit.co-0B7285?style=flat-square&logo=readthedocs&logoColor=white)](https://journalit.co/docs)
[![Discord](https://img.shields.io/badge/discord-join-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.gg/AkSw3D9h8b)

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.vi.md">Tiếng Việt</a> |
  <a href="README.hi.md">हिन्दी</a> |
  <a href="README.ta.md">தமிழ்</a>
</p>

[Cài đặt](#cài-đặt) · [Broker được hỗ trợ](#broker-được-hỗ-trợ) · [Quyền riêng tư](PRIVACY.md)

</div>

![Giao diện Home](https://github.com/user-attachments/assets/8ef38dac-c932-4530-aa06-4a382e5ba827)

## Cài đặt

Cài đặt Journalit từ Obsidian Community Plugins:

1. Mở **Settings → Community Plugins → Browse**
2. Tìm `Journalit`
3. Nhấp **Install**, sau đó **Enable**

Trang cộng đồng: https://community.obsidian.md/plugins/journalit

## Điểm nổi bật

- **Ưu tiên lưu trữ cục bộ**: phần ghi nhật ký cốt lõi nằm trong vault Obsidian của bạn.
- **Bảng điều khiển Home View**: widget kéo-thả + heatmap giao dịch.
- **Bảng điều khiển giao dịch**: theo dõi hiệu suất và các mẫu hình chỉ trong nháy mắt.
- **Bảng điều khiển tài khoản**: được xây dựng cho mục tiêu lợi nhuận và drawdown của prop firm.
- **Hệ thống đánh giá (V2)**: mẫu từ hằng ngày → hằng năm với trình tạo bố cục.
- **[Trade Import](https://journalit.co/csv-import)**: nhập giao dịch qua backend cho CSV, bảng tính, HTML và báo cáo broker.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: tự động đồng bộ giao dịch cho Tradovate và MT4.

## Thông tin quan trọng

- **Cốt lõi ưu tiên lưu trữ cục bộ**: tính năng ghi nhật ký cốt lõi hoạt động offline và lưu ghi chú cùng giao dịch trong vault Obsidian của bạn.
- **Cần tài khoản để truy cập đầy đủ**: cần có tài khoản Journalit cho các tính năng yêu cầu xác thực và các tính năng bị giới hạn bởi gói đăng ký.
- **Tính năng trả phí**: cần gói Pro trả phí để truy cập đầy đủ các tính năng Pro như đồng bộ MetaTrader và Trade Import.
- **Sử dụng mạng tùy chọn**: plugin chỉ sử dụng dịch vụ mạng của Journalit khi bạn chọn dùng các tính năng dựa trên mạng. Đăng nhập sẽ liên hệ dịch vụ Journalit để xác minh email, kiểm tra token và trạng thái đăng ký. Nếu sau đó bạn dùng các tính năng đã xác thực như đồng bộ MetaTrader hoặc Trade Import, plugin cũng kết nối tới backend API của Journalit để điều phối đồng bộ, truy xuất giao dịch và Trade Import tùy chọn; đồng bộ MetaTrader sử dụng hạ tầng FTP do Journalit quản lý để tải báo cáo lên. Journalit cũng có thể yêu cầu tỷ giá từ dịch vụ tỷ giá bên thứ ba khi cần chuyển đổi đa tiền tệ. Các tính năng dựa trên mạng này đều là tùy chọn.
- **Có mã nguồn để xem, giấy phép độc quyền**: plugin là phần mềm độc quyền có mã nguồn có thể xem xét.
- **Chi tiết quyền riêng tư**: xem [PRIVACY.md](PRIVACY.md) để biết chi tiết về xử lý dữ liệu, lưu giữ dữ liệu và hạ tầng.

## Ảnh chụp màn hình

### Bảng điều khiển giao dịch

![Bảng điều khiển giao dịch](https://github.com/user-attachments/assets/ebb402c3-c8da-41dc-9317-73f6a50d0a93)

### Setup

![Tổng quan setup](https://github.com/user-attachments/assets/09976a8b-8500-4629-b790-6cb834c84b24)

![Các cặp setup](https://github.com/user-attachments/assets/bb7b66fc-db1b-4e1c-a174-32bc6bea49c6)

![So sánh setup](https://github.com/user-attachments/assets/8eaf5509-cf27-4e73-8c8c-2a9cf0da6c43)

### Trình tạo bố cục

![Trình tạo bố cục](https://github.com/user-attachments/assets/48bcc59a-2b17-4478-98b3-dce8677cca47)

![Trình tạo bố cục](https://github.com/user-attachments/assets/66744217-b3b1-46ec-bb65-ca2debcd72da)

### Nhật ký giao dịch & Thư viện ảnh

![Nhật ký giao dịch](https://github.com/user-attachments/assets/09586646-50a2-4fd1-970f-83e926cab19a)

![Thư viện ảnh](https://github.com/user-attachments/assets/1bb496ab-a165-43c6-83f0-500565f2a1c3)

### Trade Import

![Trade Import](https://github.com/user-attachments/assets/68121823-8b24-4024-b676-a4199c81f207)

### Bảng điều khiển tài khoản

![Bảng điều khiển tài khoản](https://github.com/user-attachments/assets/dbd1cd69-3f8b-4af8-883c-460dbfb8944b)

### Trang tài khoản

![Trang tài khoản](https://github.com/user-attachments/assets/8eeb0f2d-a8d8-412e-bf23-cb21e3a0401b)

## Broker được hỗ trợ

Các định dạng nhập từ broker được hỗ trợ:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- [TradingView](https://journalit.co/docs/broker-guides-tradingview)
- [Bybit](https://journalit.co/docs/broker-guides-bybit)
- [BloFin](https://journalit.co/docs/broker-guides-blofin)
- [Hyperliquid](https://journalit.co/docs/broker-guides-hyperliquid)
- [Sierra Chart](https://journalit.co/docs/broker-guides-sierrachart)
- [MotiveWave](https://journalit.co/docs/broker-guides-motivewave)
- [FX Replay](https://journalit.co/docs/broker-guides-fxreplay)
- [ATAS](https://journalit.co/docs/broker-guides-atas)
- [Trading Technologies (TT)](https://journalit.co/docs/broker-guides-tradingtechnologies)
- [Rithmic](https://journalit.co/docs/broker-guides-rithmic)
- [MetaTrader 4/5](https://journalit.co/docs/broker-guides-jdr)

Chưa thấy broker của bạn? Tham gia [Discord](https://discord.gg/AkSw3D9h8b) và cho chúng tôi biết bạn muốn hỗ trợ broker nào tiếp theo.

<details>
<summary>Từ khóa tìm kiếm</summary>

Từ khóa: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, MetaTrader, MT4 sync, MT5 sync, Trade Import, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown

</details>

<details>
<summary>Tài nguyên khác</summary>

- [Cách hoạt động (ưu tiên lưu trữ cục bộ)](https://journalit.co/obsidian-trading-journal)
- [Tổng quan Trade Import](https://journalit.co/csv-import)
- [Tổng quan đồng bộ MetaTrader](https://journalit.co/metatrader-trading-journal)
- [So sánh với các nhật ký khác](https://journalit.co/compare)

</details>

## Giấy phép

Plugin này là phần mềm độc quyền có mã nguồn được công bố để xem xét. Mã nguồn được xuất bản để Obsidian đánh giá và để người dùng kiểm tra, nhưng không được cấp phép dưới dạng mã nguồn mở. Xem LICENSE để biết phạm vi sử dụng được phép.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
