<div align="center">

<img
  src="https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/journalit-logo.png"
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
  <a href="README.ta.md">தமிழ்</a> |
  <a href="README.ar.md">العربية</a>
</p>

[Cài đặt](#cài-đặt) · [Ứng dụng AI (MCP)](#ai-apps-mcp) · [Broker được hỗ trợ](#broker-được-hỗ-trợ) · [Quyền riêng tư](PRIVACY.md)

</div>

![Giao diện Home](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/home-view.png)

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
- **[Prop challenge](https://journalit.co/docs/prop-challenges)**: theo dõi giai đoạn evaluation và funded, drawdown, lỗ trong ngày, mục tiêu lợi nhuận và quy tắc payout, với hồ sơ firm để thiết lập.
- **Hệ thống đánh giá (V2)**: mẫu từ hằng ngày → hằng năm với trình tạo bố cục.
- **[Trade Import](https://journalit.co/csv-import)**: nhập giao dịch qua backend cho CSV, bảng tính, HTML và báo cáo broker.
- **[Trade Sync](https://journalit.co/docs/trade-sync)**: tự động đồng bộ giao dịch cho các nhà môi giới được hỗ trợ.
- **[Ứng dụng AI (MCP)](https://journalit.co/docs/ai-apps)**: kết nối ứng dụng AI để phân tích giao dịch, soạn bài đánh giá và cập nhật nhật ký.

## Ảnh chụp màn hình

### Bảng điều khiển giao dịch

![Bảng điều khiển giao dịch](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trading-dashboard.png)

### Setup

![Tổng quan setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-overview.png)

![Các cặp setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-pairs.png)

![So sánh setup](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/setup-comparison.png)

### Tài khoản & Prop challenge

![Bảng điều khiển tài khoản](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-dashboard.png)

![Trang tài khoản](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/account-pages.png)

### Trình tạo bố cục

![Trình tạo bố cục](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder.png)

![Trình tạo bố cục](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/layout-builder-preview.png)

### Nhật ký giao dịch & Thư viện ảnh

![Nhật ký giao dịch](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-log.png)

![Thư viện ảnh](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/gallery.png)

### Trade Import

![Trade Import](https://raw.githubusercontent.com/Cursivez/journalit/main/assets/readme/trade-import.png)

<a id="ai-apps-mcp"></a>

## Ứng dụng AI (MCP)

Kết nối Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot hoặc ứng dụng tương thích khác với nhật ký qua MCP (Model Context Protocol). Nhờ ứng dụng phân tích giao dịch, soạn bài đánh giá tuần hoặc cập nhật các trường trong nhật ký mà không cần sao chép ghi chú vào cuộc trò chuyện.

1. Đăng nhập Journalit trong Obsidian. Mở **Cài đặt → Journalit → Ứng dụng AI (MCP)** và bật **Bật truy cập MCP**.
2. Thêm `https://api.journalit.co/mcp` làm máy chủ MCP từ xa trong ứng dụng AI.
3. Đăng nhập Journalit khi được yêu cầu, chọn vault, kiểm tra các quyền được yêu cầu và chấp thuận kết nối.

Giữ Obsidian mở và Journalit đang chạy. Theo mặc định, việc xóa, hợp nhất và các thay đổi lớn cần bạn chấp thuận.

Xem **[hướng dẫn thiết lập ứng dụng AI](https://journalit.co/docs/ai-apps)** để biết các bước cho từng ứng dụng, quyền truy cập, cách hoàn tác và giới hạn sử dụng hằng tháng.

## Broker được hỗ trợ

Trade Sync tạo kết nối liên tục. Trade Import đọc tệp đã xuất. Một nguồn hỗ trợ cách này không có nghĩa là cũng hỗ trợ cách kia.

### Trade Sync tự động

- [MetaTrader 4](https://journalit.co/docs/trade-sync-metatrader)
- [Tradovate](https://journalit.co/docs/trade-sync-tradovate)
- [cTrader](https://journalit.co/docs/trade-sync-ctrader)
- [Hyperliquid](https://journalit.co/docs/trade-sync-hyperliquid): hợp đồng vĩnh cửu thanh toán bằng USDC, chỉ có quyền đọc

[Rithmic Trade Sync](https://journalit.co/docs/trade-sync-rithmic) là bản xem trước chỉ dành cho người thử nghiệm được chấp thuận. Sao kê MetaTrader 5 được nhập bằng Trade Import, không phải Trade Sync qua FTP.

### Trade Import từ tệp

Các nguồn và định dạng xuất được hỗ trợ:

- [IBKR](https://journalit.co/docs/broker-guides-ibkr)
- [Tradovate](https://journalit.co/docs/broker-guides-tradovate)
- [TopStepX](https://journalit.co/docs/broker-guides-topstepx)
- [TradeZero](https://journalit.co/docs/broker-guides-tradezero)
- TradingView: [lịch sử lệnh Paper Trading](https://journalit.co/docs/broker-guides-tradingview) và List of Trades của Strategy Tester (kiểm thử quá khứ)
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
- [DeepCharts](https://journalit.co/docs/broker-guides-deepcharts): Trade List trong Strategy Report
- [Breakout Terminal](https://journalit.co/docs/broker-guides-breakout-terminal): `trades.csv`
- Merrill Edge: hoạt động tài khoản ở định dạng CSV
- PropReports: báo cáo Executions cho cổ phiếu

Dùng Manual Mapping cho các tệp tương thích khác. Xem [tổng quan Trade Import](https://journalit.co/csv-import) và hướng dẫn của từng nguồn để biết cần xuất tệp nào.

Chưa thấy broker của bạn? Tham gia [Discord](https://discord.gg/AkSw3D9h8b) và cho chúng tôi biết bạn muốn hỗ trợ broker nào tiếp theo.

<details>
<summary>Từ khóa tìm kiếm</summary>

Từ khóa: obsidian trading journal, trading plugin, trade tracker, obsidian trading template, trading analytics, Trade Import, Trade Sync, prop firm, prop firms, funded account, profit target, trailing drawdown, max drawdown, prop challenge, evaluation, funded phase, payout rules, daily loss limit

AI: MCP, Model Context Protocol, Obsidian MCP, AI trading journal, AI-assisted journaling, Claude, Claude Code, ChatGPT, Codex, Hermes, Grok Bot

Broker và nền tảng: MetaTrader, MetaTrader 4, MT4 sync, MetaTrader 5 imports, IBKR, Interactive Brokers, Tradovate, cTrader, Hyperliquid, Rithmic, TopStepX, TradeZero, TradingView, TradingView Strategy Tester, Bybit, BloFin, Sierra Chart, MotiveWave, FX Replay, ATAS, Trading Technologies, DeepCharts, Breakout Terminal, Merrill Edge, PropReports

</details>

<details>
<summary>Tài nguyên khác</summary>

- [Cách hoạt động (ưu tiên lưu trữ cục bộ)](https://journalit.co/obsidian-trading-journal)
- [Tổng quan Trade Import](https://journalit.co/csv-import)
- [Tổng quan đồng bộ MetaTrader](https://journalit.co/metatrader-trading-journal)
- [So sánh với các nhật ký khác](https://journalit.co/compare)
- [Hướng dẫn prop challenge](https://journalit.co/docs/prop-challenges)

</details>

## Thông tin quan trọng

- **Cốt lõi ưu tiên lưu trữ cục bộ**: tính năng ghi nhật ký cốt lõi hoạt động offline và lưu ghi chú cùng giao dịch trong vault Obsidian của bạn.
- **Cần tài khoản để truy cập đầy đủ**: cần có tài khoản Journalit cho các tính năng yêu cầu xác thực và các tính năng bị giới hạn bởi gói đăng ký.
- **Tính năng trả phí**: cần gói Pro trả phí để dùng Trade Sync, xác nhận nhập qua Trade Import, lịch kinh tế và hồ sơ prop firm điền sẵn. Người dùng miễn phí đã đăng nhập có thể phân tích và xem trước tệp Trade Import.
- **Sử dụng mạng**: theo mặc định, Journalit kiểm tra siêu dữ liệu bản phát hành công khai trên GitHub để tìm bản cập nhật mà không gửi dữ liệu vault hoặc tài khoản. Các tính năng sau khi đăng nhập có thể dùng dịch vụ Journalit; đồng bộ MT4 dùng FTP được quản lý và chuyển đổi tiền tệ có thể dùng dịch vụ tỷ giá bên thứ ba. Xem [PRIVACY.md](PRIVACY.md).
- **Truy cập AI tùy chọn**: khi bật MCP và cấp quyền cho ứng dụng AI, dữ liệu nhật ký được yêu cầu sẽ được chia sẻ với ứng dụng qua dịch vụ Journalit. Mọi dữ liệu ứng dụng đọc đều chịu các điều khoản quyền riêng tư của nhà cung cấp AI. Bạn có thể ngắt kết nối ứng dụng hoặc tắt truy cập MCP bất cứ lúc nào.
- **Xử lý Trade Import**: thao tác phân tích và xem trước gửi tệp đã chọn cùng tùy chọn nhập tới Journalit. Các bản ghi chẩn đoán được mã hóa trên máy chủ hết hạn sau 1 ngày với tài khoản miễn phí hoặc 14 ngày với Pro; bản xem trước đã lưu hết hạn sau 7 ngày. Hướng dẫn tương thích được trả về trong các phản hồi đó và hiển thị tại máy, không tải lên báo cáo lỗi riêng từ ứng dụng khách. Xem [PRIVACY.md](PRIVACY.md).
- **Chẩn đoán mạng khác**: mã Tradovate Sync hiện có gửi sự kiện chẩn đoán đồng bộ của ứng dụng khách theo mô tả trong [PRIVACY.md](PRIVACY.md), tách biệt với Trade Import. Nút nâng cấp chỉ mở journalit.co khi được bấm, kèm tham số chiến dịch cố định, không có mã định danh, để ghi nhận nguồn truy cập trên máy chủ.
- **Có mã nguồn để xem, giấy phép độc quyền**: plugin là phần mềm độc quyền có mã nguồn có thể xem xét.
- **Chi tiết quyền riêng tư**: xem [PRIVACY.md](PRIVACY.md) để biết chi tiết về xử lý dữ liệu, lưu giữ dữ liệu và hạ tầng.

## Giấy phép

Plugin này là phần mềm độc quyền có mã nguồn được công bố để xem xét. Mã nguồn được xuất bản để Obsidian đánh giá và để người dùng kiểm tra, nhưng không được cấp phép dưới dạng mã nguồn mở. Xem LICENSE để biết phạm vi sử dụng được phép.

---

[Docs](https://journalit.co/docs) | [Discord](https://discord.gg/AkSw3D9h8b) | [X.com](https://x.com/journalitco)
