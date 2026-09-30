

import type { Lang } from './en';

const zh: Lang = {
  'templateEditor.widget.session-log.hide-empty-outside':
    '会话之外的日志为空时隐藏',
  'account.profiles.correction-title': '目录勘误',
  'account.profiles.correction-source': '规则来源',
  'account.profiles.correction-period': '受影响的历史',
  'account.profiles.correction-history': '勘误历史',
  'account.profiles.correction-stale': '账户历史已更改。请重新打开审核。',
  'account.profiles.correction-result': '硬性规则评估',
  'account.profiles.no-hard-breach': '未发现硬性违规',
  'account.profiles.correction-consent': '重新计算历史',
  'account.profiles.correction-details': '详情',
  'account.profiles.correction-apply': '应用修正',
  'account.profiles.purchase-date': '最初购买日期',
  'account.profiles.save-purchase': '保存购买日期',
  'account.profiles.purchase-needed': '输入最初购买日期以核实这些条款。',
  'account.profiles.purchase-excluded': '此购买继续适用原有条款。',
  'account.profiles.purchase-uncertain': '适用性需由公司确认。规则保持不变。',
  'account.profiles.initial-terms':
    '这些条款自购买时或本阶段开始前适用。请单独检查初始设置；历史保持不变。',
  'account.profiles.announcement': '公司公告',
  'account.profiles.firm-effective': '公司确认的生效日期',
  'account.profiles.published-date': '公告中的生效日期',
  'account.profiles.applicability-checking': '正在核实适用性…',
  'account.profiles.no-matching-phase': '这些机构规则中没有对应的阶段。',
  'account.profiles.history-unchanged': '此前历史保持不变。',
  'account.profiles.notice-title': '机构规则有更新',
  'account.profiles.notice-description':
    '机构发布的规则与此账户保存的规则不同。你的账户规则没有改变。',
  'account.profiles.review-changes': '审核更改',
  'account.profiles.check-failed': '无法检查规则更新。',
  'account.profiles.retry': '重试',
  'account.profiles.source-changed':
    '此审核打开期间机构规则已更改。请重新打开审核后再应用。',
  'account.profiles.retain': '保留当前规则',
  'account.profiles.retain-help':
    '保留账户规则并忽略此次来源更改。后续规则更改仍可再次提醒。',
  'account.profiles.comparison-help':
    '仅显示差异。展开规则可查看字段。本地自定义也可能造成差异。',
  'account.profiles.added': '新增',
  'account.profiles.removed': '移除',
  'account.profiles.changed': '已更改',
  'account.profiles.not-configured': '未配置',
  'account.profiles.no-rule-changes': '此阶段的规则和提款政策没有差异。',
  'account.profiles.accept': '应用更新',
  'account.profiles.cached': '正在使用缓存的机构规则；无法检查最新规则。',
  'account.profiles.account-phase': '账户阶段',
  'account.profiles.choose': '选择已保存的规则',
  'account.profiles.completed': '已完成阶段保留原有规则。',
  'account.profiles.confirm': '这些规则适用于我的账户。',
  'account.profiles.currency': '应用前请选择与这些规则匹配的账户货币。',
  'account.profiles.current': '账户当前规则',
  'account.profiles.custom-transition': '自定义过渡条款',
  'account.profiles.cycle-start': '出金周期开始时间（本地时间）',
  'account.profiles.delete-help':
    '删除这些已保存的规则？已在使用它们的账户不会改变。',
  'account.profiles.effective': '生效时间（本地时间）',
  'account.profiles.error': '无法保存规则。请检查数值后重试。',
  'account.profiles.floor': '过渡时的回撤底线',
  'account.profiles.history': '规则历史',
  'account.profiles.history-help':
    '旧规则会被保留。使用“审核规则更新”来更改有版本的阶段；为保护历史记录，禁止直接编辑。',
  'account.profiles.incoming': '机构的新规则',
  'account.profiles.independent':
    '已保存的规则仅存在于此仓库。应用时会在账户上创建独立副本；保存新修订版绝不会更改现有账户。',
  'account.profiles.keep-help':
    '勾选的规则保留你的本地值，而不采用同类型的新规则。取消勾选即可接受机构的值。新的规则类型会被添加。',
  'account.profiles.keep-local': '保留我的规则：',
  'account.profiles.keep-payout': '保留当前出金政策',
  'account.profiles.library': '我保存的规则',
  'account.profiles.locked': '回撤底线已锁定',
  'account.profiles.missing': '这些已保存的规则已不存在。',
  'account.profiles.peak': '保留的峰值余额',
  'account.profiles.review': '审核规则更新',
  'account.profiles.save-new': '保存这些规则',
  'account.profiles.saved': '已保存到“我保存的规则”。',
  'account.profiles.update-saved': '更新已保存的规则',
  'account.profiles.delete-saved': '删除已保存的规则',
  'account.profiles.save-revision': '另存为所选规则的新修订版',
  'account.profiles.source-phase': '机构规则中的阶段',
  'account.profiles.transition-help':
    '未提供已验证的过渡默认值。请输入公司确认的底线、峰值和周期开始时间，并标记为自定义。阶段利润和累计出金次数保留；旧交易继续使用原有规则。',
  'account.profiles.transition-source': '公司确认或参考资料',
  'account.profiles.link-intro':
    '将此挑战关联到其机构的规则，机构更改规则时 Journalit 会提醒你。你会先查看它们与此账户规则的差异；在你应用之前不会有任何更改。',
  'account.profiles.link-title': '关联机构规则',
  'account.profiles.choose-source': '选择机构规则',
  'account.profiles.update-available':
    '机构规则已更改，需要审核。你的账户仍在使用已保存的规则。',
  'account.profiles.up-to-date':
    '此阶段使用最新审核过的机构规则；本地调整保持独立。',
  'widget.mfeScatter.name': 'MFE 与已实现盈亏',
  'widget.mfeScatter.description': '每笔交易最大浮盈与最终 P&L 对比',
  'widget.mfeScatter.y': '已实现盈亏（{unit}）',
  'widget.mfeScatter.winners': '盈利',
  'widget.mfeScatter.losers': '亏损',
  'widget.mfeScatter.breakeven': '保本',
  'widget.mfeScatter.empty': '没有具备此单位有效 MFE 的已平仓交易。',

  'trade.broker-synced-at': '券商同步于 {date}',
  'trade-sync.tradovate.status.connecting': '正在连接',
  'trade-sync.tradovate.status.setup-required': '需要设置账户',
  'trade-sync.tradovate.status.paused': '已暂停',
  'trade-sync.tradovate.status.reauthorization-required': '需要重新授权',
  'trade-sync.tradovate.status.deleting': '正在删除云端数据',
  'trade-sync.tradovate.status.error': '连接错误',

  'trade-sync.tradovate.sync-complete-connection': '{connection} 同步已完成。',
  'trade-sync.tradovate.sync-partial-connection':
    '{connection} 同步完成，但存在问题。',
  'trade-sync.tradovate.sync-all': '全部同步',
  'trade-sync.tradovate.sync-all-complete':
    '已同步 {succeeded}/{total} 个 Tradovate 连接。',
  'trade-sync.tradovate.sync-all-partial':
    '已同步 {succeeded}/{total} 个 Tradovate 连接。请检查存在问题的连接。',
  'trade-sync.tradovate.connect-another': '连接另一个 Tradovate 账户',
  'trade-sync.tradovate.no-connections':
    '请先在 Journalit.co 连接 Tradovate 账户，然后在此处配置并同步。',
  'trade-sync.tradovate.claimed-by-connection':
    '此账户已通过 {connection} 启用同步。切换前请先在该连接中停用同步。',
  'trade-sync.tradovate.claim-conflict':
    '另一个 Tradovate 连接已取得此账户的同步权限。请检查刷新后的连接卡片再重试。',
  'trade-sync.tradovate.reconciliation-issues': '{count} 个对账问题',
  'trade-sync.tradovate.website-connection-description':
    '在 Journalit.co 上安全连接或重新授权 Tradovate，然后返回此处选择账户并同步此 vault。',
  'trade-sync.tradovate.paused-website-description':
    '此 Tradovate 连接已暂停。请前往 Journalit.co 管理、查看或恢复连接。',
  'trade-sync.tradovate.plugin-sync-description':
    '一次同步会获取最新的 Tradovate 活动，并将生成的交易写入此 vault。',
  'trade-sync.tradovate.connect': '连接',
  'trade-sync.tradovate.manage-connection': '管理连接',
  'trade-sync.tradovate.setup-guide': '设置指南',
  'trade-sync.tradovate.setup-and-sync': '完成设置并同步',
  'trade-sync.tradovate.sync-to-vault': '同步',
  'trade-sync.tradovate.discovery-description':
    'Journalit 需要发现 Tradovate 连接中可用的 Demo 和 Live 账户。',
  'trade-sync.tradovate.discover-accounts': '发现 Tradovate 账户',
  'trade-sync.tradovate.discovering': '正在发现账户…',
  'trade-sync.tradovate.discovery-failed':
    'Tradovate 账户发现失败。请重试，或在 Journalit.co 上管理连接。',
  'trade-sync.tradovate.sync-account': '纳入同步',
  'trade-sync.tradovate.history-label': '初始历史记录',
  'trade-sync.tradovate.history-all': '所有可用历史记录',
  'trade-sync.tradovate.history-recent': '最近 90 天',
  'trade-sync.tradovate.history-custom': '从指定日期开始',
  'trade-sync.tradovate.history-new': '仅新交易',
  'trade-sync.tradovate.start-date': '开始日期',

  'trade-sync.tradovate.mapping-required':
    '为每个启用的 Tradovate 账户选择一个本地 vault 账户。',
  'trade-sync.tradovate.custom-date-required':
    '为每个自定义历史记录选择开始日期。',
  'trade-sync.tradovate.recovery-title': '恢复缺失的交易笔记',
  'trade-sync.tradovate.recovery-count': '{count} 条交易笔记可恢复',
  'trade-sync.tradovate.recovery-select-account':
    '请先选择本地账户再恢复交易笔记。',
  'trade-sync.tradovate.recovery-confirm':
    '将 {count} 条交易笔记恢复到 {account}？',

  'trade-sync.ctrader.status.setup-required': '需要设置账户',
  'trade-sync.ctrader.status.connecting': '正在连接',
  'trade-sync.ctrader.status.paused': '已暂停',
  'trade-sync.ctrader.status.reauthorization-required': '需要重新授权',
  'trade-sync.ctrader.status.deleting': '正在删除云端数据',
  'trade-sync.ctrader.status.error': '连接错误',
  'trade-sync.ctrader.sync-complete-connection': '{connection} 同步已完成。',
  'trade-sync.ctrader.sync-partial-connection':
    '{connection} 同步完成，但存在问题。',
  'trade-sync.ctrader.sync-all': '全部同步',
  'trade-sync.ctrader.sync-all-complete':
    '已同步 {succeeded}/{total} 个 cTrader 连接。',
  'trade-sync.ctrader.sync-all-partial':
    '已同步 {succeeded}/{total} 个 cTrader 连接。请检查存在问题的连接。',
  'trade-sync.ctrader.connect-another': '连接另一个 cTrader 账户',
  'trade-sync.ctrader.no-connections':
    '请先在 Journalit.co 连接 cTrader 账户，然后在此处配置并同步。',
  'trade-sync.ctrader.claimed-by-connection':
    '此账户已通过 {connection} 启用同步。切换前请先在该连接中停用同步。',
  'trade-sync.ctrader.claim-conflict':
    '另一个 cTrader 连接已取得此账户的同步权限。请检查刷新后的连接卡片再重试。',
  'trade-sync.ctrader.reconciliation-issues': '{count} 个对账问题',
  'trade-sync.ctrader.website-connection-description':
    '在 Journalit.co 上安全连接或重新授权 cTrader，然后返回此处选择账户并同步此 vault。',
  'trade-sync.ctrader.plugin-sync-description':
    '一次同步会获取最新的 cTrader 活动，并将生成的交易写入此 vault。',
  'trade-sync.ctrader.connect': '连接',
  'trade-sync.ctrader.manage-connection': '管理连接',
  'trade-sync.ctrader.setup-guide': '设置指南',
  'trade-sync.ctrader.setup-and-sync': '完成设置并同步',
  'trade-sync.ctrader.sync-to-vault': '同步',
  'trade-sync.ctrader.discovery-description':
    'Journalit 需要发现 cTrader 连接中可用的 Demo 和 Live 账户。',
  'trade-sync.ctrader.discover-accounts': '发现 cTrader 账户',
  'trade-sync.ctrader.discovering': '正在发现账户…',
  'trade-sync.ctrader.discovery-failed':
    'cTrader 账户发现失败。请重试，或在 Journalit.co 上管理连接。',
  'trade-sync.ctrader.sync-account': '纳入同步',
  'trade-sync.ctrader.history-label': '初始历史记录',
  'trade-sync.ctrader.history-all': '所有可用历史记录',
  'trade-sync.ctrader.history-recent': '最近 90 天',
  'trade-sync.ctrader.history-custom': '从指定日期开始',
  'trade-sync.ctrader.history-new': '仅新交易',
  'trade-sync.ctrader.start-date': '开始日期',
  'trade-sync.ctrader.mapping-required':
    '为每个启用的 cTrader 账户选择一个本地 vault 账户。',
  'trade-sync.ctrader.custom-date-required':
    '为每个自定义历史记录选择开始日期。',
  'trade-sync.ctrader.recovery-title': '恢复缺失的交易笔记',
  'trade-sync.ctrader.recovery-count': '{count} 条交易笔记可恢复',
  'trade-sync.ctrader.recovery-select-account':
    '请先选择本地账户再恢复交易笔记。',
  'trade-sync.ctrader.recovery-confirm':
    '将 {count} 条交易笔记恢复到 {account}？',
  'trade-sync.oauth.remap.title': 'Change account',
  'trade-sync.oauth.remap.message':
    'Use {newAccount} for existing notes too? Otherwise, only future broker updates will use it.',
  'trade-sync.oauth.remap.update-notes': 'Update notes',
  'trade-sync.oauth.remap.future-only': 'Future updates only',
  'trade-sync.oauth.remap.unavailable':
    'Account remapping is unavailable. Update the Journalit server and try again.',
  'trade-sync.oauth.remap.restore-in-progress':
    'Wait for Restore to finish, then try again.',
  'trade-sync.oauth.remap.operation-conflict':
    'That remap request conflicted with an earlier attempt. Try again.',
  'trade-sync.oauth.remap.account-busy':
    'This account is busy synchronizing. Retry shortly.',
  'trade-sync.oauth.remap.account-unavailable':
    'This account is no longer available. Refresh and try again.',
  'trade-sync.oauth.remap.preserved-conflicts':
    '{count} existing conflict(s) were left unchanged.',
  'trade-sync.oauth.remap.notes-pending':
    '{count} existing note update(s) are still pending. Synchronize again to retry.',
  'trade-sync.source.ctrader': 'cTrader',
  'trade-sync.source.ctrader.description':
    'Synchronize cTrader trades in the cloud and project them into this vault.',
  'trade-sync.ctrader.status-failed': 'Unable to load cTrader status.',
  'trade-sync.ctrader.last-sync': 'Last sync',
  'trade-sync.ctrader.pending-acks': '{count} 个本地 ACK 待处理',
  'trade-sync.ctrader.never': 'Never',

  
  
  

  
  'command.add-trade': '添加新交易',
  'command.quick-import-trades': 'Quick import trades',
  'command.import-trades-csv': '打开 Trade Import',

  
  'command.create-drc': '打开DRC(每日交易报告)',
  'command.create-weekly-review': '打开周度回顾',
  'command.create-monthly-review': '打开月度回顾',
  'command.create-quarterly-review': '打开季度回顾',
  'command.create-yearly-review': '打开年度回顾',

  
  'command.open-dashboard': '打开仪表盘',
  'command.open-account-dashboard': '打开账户',
  'command.open-trade-log': '打开交易日志',
  'command.open-home': '打开主页',
  'command.open-settings': '打开设置',
  'command.open-position-size-calculator': '打开仓位大小计算器',

  

  
  'command.replay-onboarding': '重新播放新手引导',
  'command.replay-current-view-guide': '重播当前视图指南',
  'command.open-release-notes': '查看更新日志',

  
  'command.open-layout-builder': '打开布局编辑器',

  
  
  
  'template.switch-title': '切换布局',
  'template.switch-review-title': '切换{type}布局',

  'template.review-type.drc': '每日报告卡',
  'template.review-type.weekly': '周度复盘',
  'template.review-type.monthly': '月度复盘',
  'template.review-type.quarterly': '季度复盘',
  'template.review-type.yearly': '年度复盘',
  'template.review-type.review': '复盘',

  
  'template.builder.select-template': '选择要编辑的布局',
  'template.builder.loading': '正在加载布局构建器...',
  'template.builder.create-from-sidebar': '或从侧边栏创建一个新布局',
  'template.builder.snippet-coming-soon': '片段编辑器即将推出',

  'template.preview.empty': '此模板没有任何组件',
  'template.preview.summary': '{type} 模板 - {count} 个组件',
  'template.preview.mode': '预览模式',
  'template.preview.markdown-zone-placeholder': 'Markdown 区域 - 在此书写',
  'template.preview.markdown-zone-placeholder-with-id':
    'Markdown 区域({id})- 在此书写',
  'template.preview.widget.game-performance-desc': '心理/技术评分分布',
  'template.preview.widget.unknown-desc': '未知组件类型',

  
  'template.section.forecast': '预测',
  'template.section.performance': '表现',
  'template.section.review': '复盘',
  'template.question.drc.q1': '今天我做得好的是什么?',
  'template.question.drc.q2': '我可以改进什么?',
  'template.question.drc.q3': '下一次交易时我将专注于什么?',
  'template.question.weekly.q1': '本周哪些做得很好?',
  'template.question.weekly.q2': '本周哪些做得不好?',
  'template.question.weekly.q3': '哪些交易形态最盈利?',
  'template.question.weekly.q4': '哪些错误让我损失最多?',
  'template.question.weekly.q5': '下周我可以改进什么?',
  'template.question.monthly.q1': '这个月我学到的关键经验是什么?',
  'template.question.monthly.q2': '哪些策略表现最好?',
  'template.question.monthly.q3': '我在交易中注意到哪些模式?',
  'template.question.monthly.q4': '下个月我的目标是什么?',
  'template.question.monthly.q5': '我如何改进风险管理?',

  'template-picker.empty': '没有可用的布局。',
  'template-picker.close': '关闭',
  'template-picker.built-in': '(内置)',
  'template-picker.badge.default': '默认',
  'template-picker.badge.current': '当前',
  'template-picker.cancel': '取消',

  
  
  
  'auth.title.already-logged-in': '已登录',
  'auth.desc.already-logged-in': '您已登录{email}。',
  'auth.title.sign-in': '登录 Journalit',

  'auth.label.email': '邮箱地址',

  'auth.button.send-code': '发送验证码',

  'auth.label.code': '验证码',

  'auth.button.verify': '验证并登录',

  'auth.button.resend': '重新发送验证码',

  

  'auth.error.needs-premium': '专业版功能',

  'auth.error.network-error': '连接错误',

  
  
  
  'template-builder.modal.unsaved-changes.title': '未保存的更改',
  'template-builder.modal.unsaved-changes.body1': '此布局有未保存的更改。',
  'template-builder.modal.unsaved-changes.body2':
    '确定要在未保存的情况下切换吗?',
  'template-builder.modal.unsaved-changes.continue': '继续编辑',
  'template-builder.modal.unsaved-changes.discard': '放弃更改',
  'template-builder.modal.delete.title': '删除布局',
  'template-builder.modal.delete.body': '确定要删除"{name}"吗?',
  'template-builder.modal.delete.warning': '此操作无法撤销。',
  'template-builder.modal.delete.cancel': '取消',
  'template-builder.modal.delete.confirm': '删除',

  
  
  
  'form.section.trade-details': '交易详情',
  'form.section.trading-costs': '交易成本',
  'form.section.risk-management': '风险管理',
  'form.section.take-profits': 'Take Profits',
  'form.section.analysis-thesis': '分析与论点',

  
  
  
  'form.tab.basic': '基本',
  'form.tab.details': '详情',
  'form.tab.advanced': '高级',

  
  
  
  'form.import-shortcut.open': '打开交易导入',
  'form.manual-import-nudge.title.one': '提示：你已手动添加 {count} 笔交易',
  'form.manual-import-nudge.title.few': '提示：你已手动添加 {count} 笔交易',
  'form.manual-import-nudge.title.many': '提示：你已手动添加 {count} 笔交易',
  'form.manual-import-nudge.title.other': '提示：你已手动添加 {count} 笔交易',
  'form.manual-import-nudge.body':
    '交易导入可以批量导入你的券商或表格历史记录，无需逐笔录入。',
  'form.manual-import-nudge.cta': '预览我的交易',
  'form.manual-import-nudge.dismiss': '暂不',
  'form.layout.customize': '自定义表单',
  'form.layout.modal-title': '自定义交易表单',
  'form.layout.settings-title': '交易表单布局',

  'form.layout.input-mode': '输入模式',
  'form.layout.input-mode-prices': '价格',
  'form.layout.input-mode-pnl-risk': 'P&L + 风险',
  'form.layout.input-mode-prices-desc':
    '记录入场和出场价格，由 Journalit 计算 P&L。',
  'form.layout.input-mode-pnl-risk-desc':
    '直接记录交易 P&L 和风险金额。Journalit 会自动计算 R 倍数。',
  'form.layout.asset-type-mode': '资产类型',
  'form.layout.asset-type-mode-show': '每次选择',
  'form.layout.asset-type-mode-fixed': '固定',
  'form.layout.default-asset-type': '默认资产类型',
  'form.layout.active-fields': '显示模块',
  'form.layout.available-fields': '隐藏模块',
  'form.layout.active-fields-desc': '拖动模块重新排序。移除你不用的部分。',
  'form.layout.available-fields-desc': '需要时可将隐藏模块重新添加到交易表单。',
  'form.layout.empty-active': '没有可选模块处于显示状态。',
  'form.layout.all-active': '所有可选模块都已显示。',
  'form.layout.add-field-aria': '将 {field} 添加到交易表单',
  'form.layout.remove-field-aria': '在交易表单中隐藏 {field}',
  'form.layout.saved': '交易表单布局已保存',
  'form.layout.item.trading-costs.commission': '佣金',
  'form.layout.item.import-shortcut': '导入快捷入口',
  'form.layout.item.import-shortcut-desc': '显示一个打开交易导入的底部按钮。',
  'form.layout.item.core-details': '核心交易详情',
  'form.layout.item.core-details-desc':
    '账户、标的、方向和进出场输入始终位于最前。',
  'form.layout.item.asset-specific': '资产专属字段',
  'form.layout.item.pnl-preview': 'P&L 预览',

  'form.layout.item.trade-currency': '交易货币 / 汇率',
  'form.layout.item.trade-currency-desc':
    '以其他货币录入交易，并可选择手动指定汇率。',
  'form.layout.item.exchange-desc': '股票和加密货币交易的交易所字段。',
  'form.layout.item.direct-pnl-toggle-desc':
    '将单笔交易切换为直接输入总盈亏，而不是填写出场价格。',
  'form.layout.manual-fx-rate': '覆盖汇率',
  'form.layout.result-r': 'R 结果',
  'form.layout.entry-time': '交易时间',

  
  
  
  'form.field.account': '账户',
  'form.field.prop-challenge-phase': '阶段：{name}',
  'form.field.prop-challenge-phase.none': '此时没有阶段',
  'form.field.asset-type': '资产类型',
  'form.field.direction': '方向',
  'form.field.direction.long': '做多',
  'form.field.direction.short': '做空',
  'form.field.commission': '佣金',
  'form.field.commission-type': '类型',
  'form.field.rebate': '返佣',
  'form.field.swap': '隔夜利息',
  'form.field.other-fees': '其他费用',
  'form.field.stop-loss': '止损',
  'form.field.take-profit': 'Take Profit',
  'form.field.take-profit-short': 'TP',
  'form.field.target-price': 'Target Price',
  'form.field.close-percent': 'Close %',
  'form.field.close-size': '平仓数量',
  'form.placeholder.close-size': '0.5',
  'form.layout.take-profit-unit': '止盈平仓数量单位',
  'form.layout.take-profit-unit-percent': 'Close %',
  'form.layout.take-profit-unit-size': '数量',
  'trade.validation.take-profit-size-number': '止盈数量必须是有效数字。',
  'trade.validation.take-profit-size-positive': '止盈数量必须大于 0。',
  'trade.validation.take-profit-total-size-range':
    '止盈数量总和不能超过仓位大小。',
  'form.field.risk-amount': '风险金额',
  'form.field.profit-loss': '盈亏',
  'form.field.total-pnl': '总盈亏',
  'form.field.realized-pnl': '已实现盈亏',
  'form.field.floating-pnl': '浮动盈亏',
  'form.field.total-costs': '总成本:',
  'form.field.setup': '策略',
  'form.field.mistake': '失误',
  'form.field.custom-tags': '自定义标签',
  'form.field.trade-thesis': '交易论点',
  'form.field.time': '时间',
  'form.field.price': '价格',

  'form.field.entries': '入场',
  'form.field.exits': '出场',
  'form.field.dividends': '分红',
  'form.field.dividend-amount': '分红金额',
  'form.field.optional': '(可选)',

  
  'form.field.position-size': '仓位大小',
  'form.field.position-size.shares': '股数',
  'form.field.position-size.contracts': '合约数',
  'form.field.position-size.lots': '手数',
  'form.field.position-size.amount': '数量',
  'form.field.position-size.cfd-units': 'CFD单位',

  
  'form.field.instrument': '交易品种',
  'form.field.instrument.ticker': '股票代码',
  'form.field.instrument.option-symbol': '期权代码',
  'form.field.instrument.future-symbol': '期货代码',
  'form.field.instrument.forex-pair': '货币对',
  'form.field.instrument.crypto-symbol': '加密货币代码',
  'form.field.instrument.cfd-symbol': 'CFD代码',

  
  'form.field.exchange': '交易所',
  'form.field.expiration-date': '到期日',
  'form.field.strike-price': '行权价',
  'form.field.contract-size': '合约规模',
  'form.field.dollars-per-point': '每点价值',
  'form.field.tick-size': '最小变动价位',
  'form.field.tick-value': '每跳价值',
  'form.field.lot-size': '手数规格',
  'form.field.custom-lot-size': '自定义手数',
  'form.field.pip-value': '点值',
  'form.field.leverage-ratio': '杠杆比例',
  'form.field.trade-currency': '交易货币',
  'form.field.fx-rate': '兑{base}汇率',
  'form.field.fx-rate-override': '覆盖汇率（{quote} → {base}）',

  
  'form.forex.using-manual-rate': '使用手动汇率',
  'form.field.lot-size.standard': '标准手 (100,000)',
  'form.field.lot-size.mini': '迷你手 (10,000)',
  'form.field.lot-size.micro': '微型手 (1,000)',
  'form.field.lot-size.custom': '自定义',

  
  
  
  'form.placeholder.select-accounts': '选择账户',
  'form.placeholder.commission': '0.15',
  'form.placeholder.commission-alt': '5.50',
  'form.placeholder.rebate': '佣金返还/抵扣',
  'form.placeholder.swap': '隔夜融资费用',
  'form.placeholder.other-fees': '平台/监管费用',
  'form.placeholder.dividend-amount': '现金金额，可正可负',
  'form.placeholder.stop-loss': '可选的止损价格',
  'form.placeholder.target-price': 'Target price',
  'form.placeholder.close-percent': '50%',
  'form.placeholder.risk-amount': '计划风险金额',
  'form.placeholder.fx-rate': '1 {currency} = ? {base}（留空：使用每日汇率）',
  'form.placeholder.custom-tag': '输入自定义标签后按回车',
  'form.placeholder.thesis': '输入此交易的论点...',

  'form.placeholder.exchange-stock': '例如:NYSE、NASDAQ',
  'form.placeholder.exchange-crypto': '例如:Binance、Coinbase',
  'form.placeholder.futures-point-value': '例如:ES1为50',
  'form.placeholder.leverage': '例如:100代表1:100',

  
  
  
  'form.entry-exit.add-entry': '+ 添加入场',
  'form.entry-exit.add-exit': '+ 添加出场',
  'form.entry-exit.remove-entry': '删除入场',
  'form.entry-exit.remove-exit': '删除出场',
  'form.dividends.add-dividend': '+ 添加分红',
  'form.dividends.remove-dividend': '删除分红',
  'form.dividends.total-dividends': '分红总额:',
  'form.entry-exit.total-entry-size': '总入场数量:',
  'form.entry-exit.remaining-position': '剩余仓位:',
  'form.entry-exit.open': '(持仓中)',
  'form.entry-exit.closed': '(已平仓)',
  'form.entry-exit.direct-pnl': '直接输入盈亏而非价格',
  'form.entry-exit.direct-pnl-desc':
    '直接输入您的总盈亏。佣金和费用仍会被扣除。',
  'form.entry-exit.calc-pnl': '根据入场/出场价格和仓位计算盈亏。',
  'form.ideal-exit.title': '理想出场',

  'form.ideal-exit.price': '理想价格',
  'form.ideal-exit.size': '数量',
  'form.ideal-exit.remove': '删除理想出场',

  'form.ideal-exit.copy-actual': '复制实际出场',

  'form.ideal-exit.tooltip':
    '记录事后认为更理想的出场计划。支持分批出场用于复盘捕获效率。',
  'form.ideal-exit.empty': '暂无理想出场',
  'form.unrealized.title': '持仓价格快照',
  'form.unrealized.tooltip':
    '记录当前持仓的市场价格以跟踪未实现盈亏。交易平仓后快照会自动清除。',
  'form.unrealized.price': '快照价格',
  'form.unrealized.time': '快照时间',
  'form.unrealized.preview': '未实现盈亏',
  'form.unrealized.captured': '记录于 {time}',
  'form.layout.item.unrealized-snapshot-desc': '跟踪持仓的未实现盈亏。',
  'trade.validation.unrealized-snapshot-price-non-negative':
    '快照价格必须大于或等于零',
  'trade.validation.unrealized-snapshot-open-position-required':
    '快照时间必须位于持仓未平仓期间。',
  
  
  
  'form.trade-type.title': '交易类型',
  'form.trade-type.subtitle': '选择您要创建的交易类型',
  'form.trade-type.regular': '常规交易',
  'form.trade-type.regular-desc': '包含完整入场和出场数据的普通交易',
  'form.trade-type.missed': '错过的交易',
  'form.trade-type.missed-desc': '错过的交易机会 - 盈亏和账户字段为可选',
  'form.trade-type.backtest': '回测交易',
  'form.trade-type.backtest-desc': '用于分析目的的回测场景',
  'form.trade-type.missed-reason': '为什么错过了这笔交易?',
  'form.trade-type.missed-reason-placeholder':
    '描述您错过这个交易机会的原因...',

  
  
  
  'button.save': '保存',
  'button.cancel': '取消',
  'button.close': '关闭',
  'button.delete': '删除',
  'button.update': '更新',
  'button.open': '打开',
  'button.add': '添加',
  'button.create': '创建',
  'button.reset': '重置',

  'button.confirm': '确认',

  'button.add-trade': '添加交易',
  'button.update-trade': '更新交易',
  'button.save-changes': '保存更改',
  'button.create-trade': '创建交易',
  'button.delete-all': '全部删除',
  'button.clear-all': '全部清除',

  'button.cancel-reset': '取消重置',
  'button.proceed-anyway': '仍然继续',
  'button.mark-reviewed': '标记为已审阅',

  'button.learn-more': '了解更多',
  'button.upload-image': '上传媒体',
  'button.discord': 'Discord',

  
  
  
  'validation.edit': '编辑',
  'validation.fix-errors': '请修复以下错误:',

  'validation.complete-required': '请填写所有必填字段',

  'validation.missed-trade-requires-exit':
    '错过的交易必须填写非零价格的平仓数据。它们代表已错过的机会,因此需要指定本应的平仓价格。',

  
  
  
  'trade.validation.entry-required': '至少需要一条开仓记录。',
  'trade.validation.entry-time-required': '开仓时间为必填项。',
  'trade.validation.entry-price-required': '开仓价格为必填项。',
  'trade.validation.entry-size-positive': '开仓数量必须大于0。',
  'trade.validation.exit-required-closed': '已平仓交易至少需要一条平仓记录。',
  'trade.validation.exit-time-required': '平仓时间为必填项。',
  'trade.validation.exit-price-required': '平仓价格为必填项。',
  'trade.validation.exit-size-positive': '平仓数量必须大于0。',
  'trade.validation.exit-size-exceeds-entry': '平仓总数量不能超过开仓总数量。',
  'trade.validation.exit-before-entry': '平仓不能早于首次开仓。',
  'trade.validation.dividend-time-required': '分红时间为必填项。',
  'trade.validation.dividend-amount-nonzero': '分红金额必须为非零数字。',
  'trade.validation.direct-pnl-required': '请输入盈亏值。',
  'trade.validation.entry-time-select': '请选择开仓时间。',
  'trade.validation.direction-required': '请选择方向。',
  'trade.validation.asset-type-required': '请选择资产类型。',
  'trade.validation.ticker-required': '请选择代码。',
  'trade.validation.ticker-invalid': '请输入有效代码(仅字母、数字和句号)。',
  'trade.validation.account-required': '请选择至少一个账户。',
  'trade.validation.exit-time-select': '请选择平仓时间。',
  'trade.validation.entry-price-invalid': '请输入有效的开仓价格。',
  'trade.validation.exit-price-invalid': '请输入有效的平仓价格。',
  'trade.validation.position-size-invalid': '请输入有效的仓位大小。',
  'trade.validation.exit-time-after-entry': '平仓时间必须晚于开仓时间。',
  'trade.validation.expiration-date-required': '请选择到期日。',
  'trade.validation.strike-price-required': '请输入行权价。',
  'trade.validation.option-type-required': '请选择期权类型(看涨或看跌)。',
  'trade.validation.contract-size-positive': '合约大小必须大于0。',
  'trade.validation.dollars-per-point-min': '请输入每点美元(最小 0.01)。',
  'trade.validation.lot-size-nonnegative': '手数必须大于零。',
  'trade.validation.leverage-positive': '杠杆比例必须大于0。',
  'trade.validation.commission-type-invalid':
    '佣金类型必须为"固定"或"百分比"。',
  'trade.validation.commission-number': '佣金必须为数字。',
  'trade.validation.commission-percentage-range':
    '百分比佣金必须在 0 到 100 之间。',
  'trade.validation.rebate-options-only': '返佣仅适用于期权交易。',
  'trade.validation.rebate-number': '返佣必须为数字。',
  'trade.validation.rebate-positive': '返佣必须为正数。',
  'trade.validation.swap-invalid': '隔夜费金额无效。',
  'trade.validation.fees-number': '费用必须为数字。',
  'trade.validation.risk-number': '风险金额必须为数字。',
  'trade.validation.risk-valid-number': '风险金额必须为有效数字。',
  'trade.validation.risk-positive': '风险金额必须大于0。',
  'trade.validation.fx-rate-number': '汇率必须是有效数字。',
  'trade.validation.fx-rate-positive': '汇率必须大于零。',
  'trade.validation.stop-loss-number': '止损必须为数字。',
  'trade.validation.stop-loss-valid-number': '止损必须为有效数字。',

  'trade.validation.take-profit-price-required':
    'Take profit price is required.',
  'trade.validation.take-profit-price-number':
    'Take profit price must be a number.',
  'trade.validation.take-profit-price-valid-number':
    'Take profit price must be a valid number.',
  'trade.validation.take-profit-close-percent-number':
    'Take profit close percent must be a number.',
  'trade.validation.take-profit-close-percent-valid-number':
    'Take profit close percent must be a valid number.',
  'trade.validation.take-profit-close-percent-range':
    'Take profit close percent must be between 1 and 100.',
  'trade.validation.take-profit-total-close-percent-range':
    'Take profit close percentages cannot exceed 100.',
  
  
  
  'validation.custom-field.key-empty': '字段键不能为空',
  'validation.custom-field.key-conflict': '此字段名与内置交易字段冲突',
  'validation.custom-field.key-format':
    '字段键必须以字母开头,且仅包含字母、数字和下划线',
  'validation.custom-field.required': '{label}为必填项',
  'validation.custom-field.text': '{label}必须为文本',
  'validation.custom-field.min-length': '{label}至少需要 {minLength} 个字符',
  'validation.custom-field.max-length': '{label}不能超过 {maxLength} 个字符',
  'validation.custom-field.pattern-invalid': '{label}格式无效',
  'validation.custom-field.pattern-invalid-pattern': '{label}的验证模式无效',
  'validation.custom-field.number': '{label}必须为数字',
  'validation.custom-field.min': '{label}不得小于 {min}',
  'validation.custom-field.max': '{label}不得大于 {max}',
  'validation.custom-field.selection': '{label}必须是有效的选择',
  'validation.custom-field.option': '{label}必须是有效选项',
  'validation.custom-field.array': '{label}必须是选项数组',
  'validation.custom-field.invalid-option': '{label}包含无效选项:{item}',
  'validation.custom-field.date': '{label}必须是有效日期',
  'validation.custom-field.time': '{label}必须是有效时间',
  'validation.custom-field.time-format':
    '{label}必须是有效的时间格式(HH:MM、HH:MM:SS,或12小时制含 AM/PM)',
  'validation.custom-field.time-values': '{label}包含无效时间值',

  
  
  

  'notice.login-success': '登录成功!',
  'notice.pro-access-ready': 'PRO 权限已就绪。',

  'notice.logout-success': '已成功退出登录',
  'notice.hotkey-set': '快捷键已设置：{hotkey}',
  'notice.ftp-created': 'FTP凭据创建成功',
  'notice.ftp-password-rotated':
    '已为此设备生成新的FTP凭据。在其他设备上配置的FTP同步（例如您的MetaTrader EA）必须更新为新密码。',
  'notice.ftp-reused':
    '已加载此设备上现有的FTP凭据。如果它们不再有效，请使用重置密码。',
  'notice.ftp-reset': 'FTP密码重置成功!请保存新密码。',
  'notice.template-saved': '布局已保存',
  'notice.template-created': '布局已创建',
  'notice.template-duplicated': '布局已复制',
  'notice.template-deleted': '布局已删除',
  'notice.default-template-updated': '默认布局已更新',
  'notice.tradelog-saved': '交易日志设置保存成功',
  'notice.settings-exported': '设置已导出至 {filename}',
  'notice.settings-imported':
    '已成功从v{version}导入设置。重启Obsidian以应用所有更改。',

  'notice.template-switched': '已切换至:{name}',
  'notice.auto-sync-toggled': '自动同步已{status}',
  'notice.auto-sync-enabled': '启用',
  'notice.auto-sync-disabled': '禁用',
  'notice.reset-items': '已重置为默认项目',

  'notice.custom-fields-imported': '已成功导入 {count} 个自定义字段',

  'notice.setups-added': '已为 {count} 笔交易添加策略',
  'notice.tags-added': 'Added tags to {count} trades',
  'notice.mistakes-added': '已为 {count} 笔交易添加失误',

  
  
  
  'notice.error.open-journalit': '无法打开Journalit。请尝试重新加载Obsidian。',
  'notice.error.open-drc': '无法打开DRC:{error}',
  'notice.error.open-trade-log': 'Failed to open Trade Log: {error}',
  'notice.error.open-csv-import': 'Failed to open Trade Import: {error}',
  'notice.error.open-weekly-review': '无法打开周度回顾:{error}',
  'notice.error.open-monthly-review': '无法打开月度回顾:{error}',
  'notice.error.open-quarterly-review': '无法打开季度回顾:{error}',
  'notice.error.open-yearly-review': '无法打开年度回顾:{error}',

  'notice.error.open-release-notes': '无法打开更新日志:{error}',
  'notice.guide.replay-unavailable': '指南系统尚未就绪，请稍后重试。',
  'notice.guide.no-active-view':
    '请先打开支持的 Journalit 视图，再运行此命令。',
  'notice.guide.no-guide-for-view': '当前视图尚未注册指南（{viewType}）。',
  'notice.guide.unavailable-in-current-state':
    '当前视图的指南在此状态下不可用。',
  'notice.guide.replay-failed': '无法启动该指南，请重试。',
  'notice.guide.replay-started': '已为当前视图重新启动指南。',
  'notice.error.open-layout-builder': '无法打开布局编辑器：{error}',
  'notice.error.switch-template': '切换布局失败：{error}',
  'notice.error.no-active-file': '没有活动文件。请先打开一个笔记。',
  'notice.error.no-template-support': '此笔记类型不支持布局。',
  'notice.error.no-templates': '此笔记类型没有可用布局。',
  'notice.error.asset-type-required': '添加交易品种时需要选择资产类型',
  'notice.error.column-required': '至少需要保留一个可见列',
  'notice.error.save-settings': '保存设置时出错:{error}',
  'notice.error.sign-in-vault': '请登录以注册您的保管库。',
  'notice.error.sign-in-sync': '请登录以使用自动同步功能。',
  'notice.error.restore-auth': '无法恢复认证。请在 设置 → 认证 重新登录。',
  'notice.error.export-settings': '导出设置失败。请查看控制台了解详情。',
  'notice.error.import-settings': '导入设置失败:{error}',
  'notice.error.reset-settings': '重置设置失败。请查看控制台了解详情。',

  'notice.error.mark-reviewed': '标记交易为已审阅时出错:{error}',
  'notice.error.add-setups': '添加策略时出错:{error}',
  'notice.error.add-tags': 'Error adding tags: {error}',
  'notice.error.add-mistakes': '添加失误时出错:{error}',
  'notice.error.duplicate-trades': '复制交易时出错:{error}',
  'notice.error.delete-trades': '删除交易时出错:{error}',
  'notice.error.csv-validation': 'CSV/XLSX/XLS验证失败:{errors}',
  'notice.error.import-failed': '导入失败:{error}',
  'notice.error.file-too-large': '文件过大。最大允许10MB',
  'notice.error.select-csv': '请选择一个 CSV/XLSX/XLS/HTML 文件',
  'notice.error.cannot-delete-builtin': '无法删除内置布局',
  'notice.error.duplicate-to-customize': '请复制此布局以进行自定义',
  'notice.error.sign-out': '无法退出登录。请再试一次。',
  'notice.error.open-upgrade-modal': '请求了高级功能,但升级对话框无法加载。',

  
  
  

  'notice.info.settings-recovered': '设置已从备份恢复。部分最近更改可能丢失。',
  'notice.info.cannot-remove-locked': '无法移除锁定的组件',

  
  
  
  'tradelog.title': '交易日志',
  'tradelog.root.all-trades': '所有交易',
  'tradelog.view.selector.label': '视图',

  'trade-form.guide.customization-modal.title': '让表单匹配你的工作流程',
  'trade-form.guide.customization-modal.description':
    '你可以在这里显示、隐藏和重新排序可选模块。让表单专注于你真正使用的字段。',
  'trade-form.guide.finish.title': '这就是自定义功能',
  'trade-form.guide.finish.description':
    '当交易表单需要匹配不同的日志流程时，你可以随时回到这个按钮进行调整。',
  'tradelog.guide.empty.intro.title': 'Welcome to Trade Log',
  'tradelog.guide.empty.intro.description':
    'This page becomes your main place for browsing, sorting, and reviewing trades. Once you add trades, you will also get the full Trade Log tour.',
  'tradelog.guide.empty.state.title': '没有可用的交易数据',
  'tradelog.guide.empty.state.description':
    '导入以往交易即可查看表现，或者手动记录一笔新交易。',
  'tradelog.guide.intro.title': 'This is your Trade Log',
  'tradelog.guide.intro.description':
    'Use this page to review trades one by one, sort them, filter them, and make changes to many trades at once.',
  'tradelog.guide.view-selector.title':
    'Choose how you want to review your history',
  'tradelog.guide.view-selector.description':
    'Use this menu to switch between the full trade table and grouped time views like months, weeks, or days. Trades is the default, but grouped views are useful when you want to review by period.',
  'tradelog.guide.filters.title': 'Use filters to narrow the Trade Log',
  'tradelog.guide.filters.description':
    '想只查看某些账户、交易设置、标签、交易类型、状态或日期时，打开筛选。也可以排除任意值，把这些交易去掉。',
  'tradelog.guide.sorting.title': 'Click column headers to sort the table',
  'tradelog.guide.sorting.description':
    'In Trades view, click a sortable column header to reorder the table. For example, click Net P&L to sort by your biggest win and biggest loss.',
  'tradelog.guide.gallery-mode.title': '还有图片画廊',
  'tradelog.guide.gallery-mode.description':
    '在此切换模式，以画廊方式浏览交易截图。首次打开时会有简短指南。',
  'tradelog.guide.multi-select.title': 'Turn on multi-select',
  'tradelog.guide.multi-select.description':
    'Click this button to select several trades at once. When multi-select is on, row clicks select trades instead of opening them.',
  'tradelog.guide.batch-actions.title': 'These are your batch actions',
  'tradelog.guide.batch-actions.description':
    'Use this bar to select all visible trades, clear your selection, mark trades as reviewed, add setups, add mistakes, duplicate trades, or delete several trades at once. You can also shift-click to select a range of trades.',
  'tradelog.guide.column-settings.title': 'Open column settings',
  'tradelog.guide.column-settings.description':
    'Click this button to choose which columns are shown and how dense or detailed the table should feel.',
  'tradelog.guide.active-columns.title':
    'Reorder or remove the columns you already use',
  'tradelog.guide.active-columns.description':
    'In Active Columns, drag a column to move it, or remove one you do not need. This changes the order of the table from left to right.',
  'tradelog.guide.available-columns.title':
    'Add hidden columns back when you need more detail',
  'tradelog.guide.available-columns.description':
    'Open Available Columns to add fields back into the table. That is where you bring back anything you removed earlier.',
  'tradelog.guide.open-trades.title':
    'Click a trade when you want to open its note',
  'tradelog.guide.open-trades.description':
    'In normal mode, clicking a trade opens it. In multi-select mode, clicking selects it instead. Switch between those two behaviours depending on what you are trying to do.',
  'dashboard.guide.empty.intro.title': 'Welcome to your Dashboard',
  'dashboard.guide.empty.intro.description':
    'Journalit 获得可分析的交易历史后，仪表盘即可发挥作用。',
  'dashboard.guide.empty.state.title': '带上你的交易历史',
  'dashboard.guide.empty.state.description':
    '导入以往交易，从有意义的表现数据开始；如果你刚开始记录交易，也可以手动添加。',
  'dashboard.guide.main.intro.title': '这是您的仪表盘',
  'dashboard.guide.main.intro.description':
    'Use this page to track your performance, review your stats, and keep your most useful charts in one place.',
  'dashboard.guide.main.filters.title': 'Filters change the whole Dashboard',
  'dashboard.guide.main.filters.description':
    '想让本页的所有统计和图表按其他日期范围、账户、交易设置、标签或交易类型更新时，使用筛选。也可以排除任意值，把这些交易去掉。',
  'dashboard.guide.main.edit-layout.title':
    'Turn on edit mode to customise this page',
  'dashboard.guide.main.edit-layout.description':
    'Click Edit Layout to unlock moving, resizing, removing, and adding Dashboard widgets.',
  'dashboard.guide.main.open-widget-selector.title': 'Open Add Widget',
  'dashboard.guide.main.open-widget-selector.description':
    'Click Add Widget to add more charts and bring back widgets you removed earlier.',
  'dashboard.guide.main.widget-picker.title': 'Pick what you want to show',
  'dashboard.guide.main.widget-picker.description':
    '此面板预览所有图表和指标。点击即可添加；已在仪表盘上的内容会列在“使用中”下。',
  'dashboard.guide.main.metrics.title':
    'These top cards are your quick summary',
  'dashboard.guide.main.metrics.description':
    'The top row gives you fast answers like profit, win rate, and total trades. In edit mode, you can change which cards appear and reorder them.',
  'dashboard.guide.main.bottom.title':
    'This is where moving and resizing happens',
  'dashboard.guide.main.bottom.description':
    'While Edit Layout is on, drag a widget to move it. To resize a widget, drag its bottom-right corner. This is the step many users miss.',
  'dashboard.guide.main.save-layout.title':
    'Save your layout when you are done',
  'dashboard.guide.main.save-layout.description':
    'When you finish customising, click Save Layout to keep your changes. You can come back and edit this page again anytime.',
  'home.guide.intro.title': '欢迎回家',
  'home.guide.intro.description':
    'This is your main page. It shows your trading stats, quick actions, and shortcuts to the rest of Journalit.',
  'home.guide.filters.title': 'These buttons change what your widgets show',
  'home.guide.filters.description':
    'Use these to switch the time period, trade type, or account so your Home widgets show the data you want to look at.',
  'home.guide.settings.title': 'Journalit 设置始终触手可及',
  'home.guide.settings.description': '使用此按钮可直接打开 Journalit 设置。',
  'home.guide.customize.title': 'Turn on edit mode to customise Home',
  'home.guide.customize.description':
    'Click this button to start customising. Edit mode unlocks moving, resizing, removing, and adding widgets.',
  'home.guide.quick-links-position.title':
    'Move Quick Links above or below the widgets',
  'home.guide.quick-links-position.description':
    'Use this button to choose whether the Quick Links row sits above the main widget area or below it.',
  'home.guide.quick-links.title': 'These Quick Links are your fast shortcuts',
  'home.guide.quick-links.description':
    'Quick Links give you one-click shortcuts to common actions and pages. In edit mode, you can also hide links you do not want showing here.',
  'home.guide.move-and-resize.title': 'Move and resize your widgets',
  'home.guide.widget-picker.title': 'Add widgets here',
  'home.guide.widget-picker.description':
    '预览并添加组件、恢复快捷链接，或添加账户和交易设置快捷方式。首页上已有的内容会列在“使用中”下，可在那里移除。',
  'home.guide.move-and-resize.description':
    'This is the main area you can rearrange in edit mode. Drag widgets to move them, or drag a widget from its bottom-right corner to resize it.',
  'home.guide.add-widget.title': '向首页添加项目',
  'home.guide.add-widget.description':
    '打开“添加小组件”以添加组件、快捷链接或账户和交易设置快捷方式。',
  'home.guide.save-layout.title': 'Save your layout when you are done',
  'home.guide.save-layout.description':
    'When you are happy with the layout, click this button to save your changes and leave edit mode.',
  'home.guide.widget-interactions.title': 'That is the main idea of Home',
  'home.guide.widget-interactions.description':
    'Home is your customisable dashboard. Use edit mode to change the layout, and click widgets to open tools, settings, or deeper pages.',
  'layoutBuilder.guide.intro.title': 'This is your Layout Builder',
  'layoutBuilder.guide.intro.description':
    'This page controls how your review templates are structured. The easiest way to start is to duplicate a built-in template, then customise your copy.',
  'layoutBuilder.guide.sidebar-overview.title':
    'This sidebar is where you choose what you are editing',
  'layoutBuilder.guide.sidebar-overview.description':
    'Each section in the sidebar is a different template type. Trade templates are separate from your review templates, and the Library section is for sharing templates. After you make your own copy, you can star it to make it the default for new review notes.',
  'layoutBuilder.guide.pick-built-in.title':
    'Start with a built-in DRC template',
  'layoutBuilder.guide.pick-built-in.description':
    'For your first layout, start with one of the built-in DRC templates. It gives you a safe starting point before you make your own copy.',
  'layoutBuilder.guide.duplicate.title': 'Duplicate the built-in layout',
  'layoutBuilder.guide.duplicate.description':
    'Built-in templates are starting points. Duplicate one first so you can safely make your own version.',
  'layoutBuilder.guide.preview-template.title':
    'This preview shows what the template will look like',
  'layoutBuilder.guide.preview-template.description':
    'Scroll through the preview and get a feel for the flow. This is useful for checking whether the template reads clearly before you start editing it.',
  'layoutBuilder.guide.switch-to-editor.title': 'Switch to Editor',
  'layoutBuilder.guide.switch-to-editor.description':
    'Preview shows you what the template will look like. Editor is where you actually change it.',
  'layoutBuilder.guide.editor-overview.title':
    'This is where you edit the template',
  'layoutBuilder.guide.editor-overview.description':
    'Rename the template here, review the widget list, drag the left handle to rearrange widgets, click a widget to change it, and remove anything you do not need.',
  'layoutBuilder.guide.add-widget.title': 'Add a widget to your copy',
  'layoutBuilder.guide.add-widget.description':
    'Use Add Widget to put new blocks into your template. This is how you shape the workflow to match how you review.',
  'layoutBuilder.guide.open-widget-picker.title': 'Open the widget picker',
  'layoutBuilder.guide.open-widget-picker.description':
    'This picker shows the widgets you can add for this review type.',
  'layoutBuilder.guide.choose-widget.title': 'Choose a widget',
  'layoutBuilder.guide.choose-widget.description':
    '在搜索框中输入组件名称、描述或类别，然后选择所需组件。也可以按“下一步”，让 Journalit 选择第一个搜索结果。',
  'layoutBuilder.guide.widget-library-docs.title':
    'Use the widget library if you get stuck',
  'layoutBuilder.guide.widget-library-docs.description':
    'This opens the docs page with the widget library, examples, and availability table for each review type.',
  'layoutBuilder.guide.save-template.title': 'Save your layout',
  'layoutBuilder.guide.save-template.description':
    'Once your copy looks right, save it. You can keep refining it later as your review process improves.',
  'layoutBuilder.guide.set-default-template.title':
    'Set this copy as your default template',
  'layoutBuilder.guide.set-default-template.description':
    'Click the star on your new template if you want new review notes to use this layout automatically.',
  'tradelog.empty': '未找到交易记录',
  'tradelog.empty.submessage': '开始创建交易笔记,它们将显示在您的交易日志中。',
  'tradelog.processing': '正在处理交易数据...',
  'tradelog.node.file-not-found': '未找到交易文件:{path}',
  'tradelog.node.expand': '展开',
  'tradelog.node.collapse': '折叠',
  'tradelog.node.navigate-to-review': '前往{type}复盘',
  'tradelog.node.performance.year': '表现{indicator}的年度',
  'tradelog.node.performance.quarter': '{year}年表现{indicator}的季度',
  'tradelog.node.performance.month': '{year}年{quarter}表现{indicator}的月份',
  'tradelog.node.performance.week': '{year}年{month}表现{indicator}的周',
  'tradelog.node.performance.day': '{year}年{week}表现{indicator}的日',
  'tradelog.node.performance.period': '表现{indicator}的时段',
  'tradelog.filter.all': '全部',
  'tradelog.filter.winners': '盈利',
  'tradelog.filter.losers': '亏损',
  'tradelog.filter.breakeven': '保本',
  'tradelog.filter.breakeven.desc': '保本交易',
  'tradelog.filter.open': '持仓中',
  'tradelog.filter.open.desc': '当前持仓中的交易',
  'tradelog.filter.closed': '已平仓',
  'tradelog.type.regular': '常规',
  'tradelog.type.regular.desc': '标准交易',
  'tradelog.type.missed': '错过',
  'tradelog.type.backtest': '回测',

  
  'tradelog.status.win': '盈利',
  'tradelog.status.loss': '亏损',
  'tradelog.status.open': '持仓',
  'tradelog.status.partially-closed': '部分平仓',
  'tradelog.status.cancelled': '已取消',
  'tradelog.status.breakeven': '保本',
  'tradelog.status.missed': '错过',
  'tradelog.status.backtest': '回测',
  'tradelog.status.expired': '已过期',

  
  'tradelog.no-columns': '未配置列',
  'tradelog.duration.ongoing': '（进行中）',
  'tradelog.tooltip.mistakes': '失误：',
  'tradelog.tooltip.setups': '策略：',
  'tradelog.tooltip.tags': '标签：',
  'tradelog.tooltip.thesis': '交易论点：',
  'tradelog.tooltip.mtComment': 'MT备注：',
  'tradelog.tooltip.accounts': '账户：',
  'tradelog.copy-trade.tooltip': 'Copied from {account} at {multiplier}x',
  'tradelog.tooltip.partial-exits': '部分平仓：',
  'tradelog.copy-trade.base-tooltip-title': 'Copied account results',
  'tradelog.copy-trade.adjustment-action': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-title': 'Adjust copied PnL',
  'tradelog.copy-trade.adjustment-description-primary':
    'Enter the manual PnL adjustment for this copied trade.',
  'tradelog.copy-trade.adjustment-description-secondary':
    'Use a negative number for worse fills/costs.',
  'tradelog.copy-trade.adjustment-preview': 'Preview net P&L:',

  'tradelog.copy-trade.adjustment-invalid': 'Enter a valid PnL adjustment.',
  'tradelog.copy-trade.adjustment-saved': 'Copied trade PnL adjustment saved.',
  'tradelog.tooltip.still-open': '仍持仓中',

  'tradelog.alt.trade-image': '{instrument}图片',
  'tradelog.alt.trade-image-n': '{instrument}图片 {n}',

  
  'tradelog.batch.delete-confirm.title': '确认删除',
  'tradelog.batch.delete-confirm.message.one':
    '确定要删除选中的 {count} 笔交易吗?',
  'tradelog.batch.delete-confirm.message.few':
    '确定要删除选中的 {count} 笔交易吗?',
  'tradelog.batch.delete-confirm.message.many':
    '确定要删除选中的 {count} 笔交易吗?',
  'tradelog.batch.delete-confirm.message.other':
    '确定要删除选中的 {count} 笔交易吗?',
  'tradelog.batch.delete-confirm.warning': '此操作无法撤销。',
  'tradelog.batch.setups.title': '为交易添加策略',
  'tradelog.batch.setups.placeholder': '选择或创建策略...',
  'tradelog.batch.tags.title': 'Add Tags to Trades',
  'tradelog.batch.tags.placeholder': 'Select or create tags...',
  'tradelog.batch.mistakes.title': '为交易添加失误',
  'tradelog.batch.mistakes.placeholder': '选择或创建失误...',
  'tradelog.batch.none-selected': '未选中',
  'tradelog.batch.selected-count': '已选中 {count} 笔',
  'tradelog.batch.select-all.title': '选择所有可见交易',
  'tradelog.batch.select-all.label': '全选',

  'tradelog.batch.already-reviewed': '所有 {total} 笔选中交易均已复盘',
  'tradelog.batch.already-reviewed-single': '选中的交易已复盘',
  'tradelog.batch.already-reviewed-plain': '已复盘',
  'tradelog.batch.no-updates-needed':
    '无需更新 - 所有 {total} 笔交易已有这些{type}',
  'tradelog.batch.already-had-all': '{count} 笔已有全部{type}',
  'tradelog.batch.errors-count.one': '发生 {count} 个错误',
  'tradelog.batch.errors-count.few': '发生 {count} 个错误',
  'tradelog.batch.errors-count.many': '发生 {count} 个错误',
  'tradelog.batch.errors-count.other': '发生 {count} 个错误',
  'tradelog.batch.enable-multi-select': '启用多选',
  'tradelog.batch.disable-multi-select': '禁用多选',
  'tradelog.batch.column-settings': '列设置',
  'tradelog.batch.marking-reviewed': '标记中...',
  'tradelog.batch.add-setups.aria': '添加策略',

  'tradelog.batch.add-setups.label': '添加策略',
  'tradelog.batch.add-tags.aria': 'Add tags',

  'tradelog.batch.add-tags.label': 'Add Tags',
  'tradelog.batch.add-mistakes.aria': '添加失误',

  'tradelog.batch.add-mistakes.label': '添加失误',
  'tradelog.batch.adding': '添加中...',
  'tradelog.batch.add-count': '添加({count})',
  'tradelog.batch.duplicate.aria': '复制交易',
  'tradelog.batch.duplicate.label': '复制',
  'tradelog.batch.duplicating': '复制中...',
  'tradelog.batch.duplicate-skipped.one': '{count}条所选笔记无法复制',
  'tradelog.batch.duplicate-skipped.few': '{count}条所选笔记无法复制',
  'tradelog.batch.duplicate-skipped.many': '{count}条所选笔记无法复制',
  'tradelog.batch.duplicate-skipped.other': '{count}条所选笔记无法复制',
  'tradelog.batch.delete.aria': '删除交易',

  'tradelog.batch.deleting': '删除中...',
  'tradelog.batch.clear.aria': '清除选择',

  'tradelog.batch.clear.label': '清除',

  
  
  
  'tradelog.settings.modal.unsaved-changes.body1':
    '您在列设置中有未保存的更改。',
  'tradelog.settings.modal.unsaved-changes.body2': '确定要关闭而不保存吗?',
  'tradelog.settings.active-columns': '已激活列',
  'tradelog.settings.available-columns': '可用列',
  'tradelog.settings.active-desc': '拖拽可重新排序。点击 X 可移除。',
  'tradelog.settings.available-desc': '点击列可添加到表格。',
  'tradelog.settings.no-active': '暂无激活列。请从可用标签页添加列。',
  'tradelog.settings.all-active': '所有列均已激活。',
  'tradelog.settings.expanded-view': '展开视图',
  'tradelog.settings.expanded-view-desc': '将标签、策略和失误显示为标签样式',
  'tradelog.settings.expanded-view-aria': '切换展开视图模式',
  'tradelog.settings.saving': '保存中...',
  'tradelog.settings.reset': '重置为默认值',

  'tradelog.category.basic': '基本信息',
  'tradelog.category.timing': '时间',
  'tradelog.category.prices': '价格',
  'tradelog.category.risk': '风险管理',
  'tradelog.category.position': '仓位与盈亏',
  'tradelog.category.review': '复盘',

  'tradelog.column.image': '图片',
  'tradelog.column.account': '账户',
  'tradelog.column.ticker': '代码',
  'tradelog.column.exchange': '交易所',
  'tradelog.column.status': '状态',
  'tradelog.column.direction': '方向',
  'tradelog.column.date': '开仓日期',
  'tradelog.column.entryTime': '入场时间',
  'tradelog.column.exitDate': '平仓日期',
  'tradelog.column.exitTime': '出场时间',
  'tradelog.column.duration': '持仓时长',
  'tradelog.column.expirationDate': '到期日',
  'tradelog.column.daysToExpiry': '剩余天数',
  'tradelog.column.entryPrice': '入场价',
  'tradelog.column.exitPrice': '出场价',
  'tradelog.column.priceMove': '价格变动',
  'tradelog.column.stopLoss': '止损',
  'tradelog.column.slDistanceDollar': '止损距离 $',
  'tradelog.column.slDistancePercent': '止损距离 %',
  'tradelog.column.riskAmount': '风险金额',
  'tradelog.column.rMultiple': '盈亏比',
  'tradelog.column.maxR': 'Max R',
  'tradelog.column.maePrice': 'MAE价格',
  'tradelog.column.mfePrice': 'MFE价格',
  'tradelog.column.mae': 'MAE',
  'tradelog.column.mfe': 'MFE',
  'tradelog.column.mae-with-currency': 'MAE ({currency})',
  'tradelog.column.mfe-with-currency': 'MFE ({currency})',
  'tradelog.column.maePercent': 'MAE %',
  'tradelog.column.mfePercent': 'MFE %',
  'tradelog.column.positionSize': '数量',
  'tradelog.column.positionValue': '市值',
  'tradelog.column.fees': '费用',
  'tradelog.column.dividends': '分红',
  'tradelog.column.pnl': '净盈亏',
  'tradelog.column.returnPercent': 'Return %',
  'tradelog.column.setups': '策略',
  'tradelog.column.mistakes': '失误',
  'tradelog.column.tags': '标签',
  'tradelog.column.reviewed': '已复盘',
  'tradelog.column.thesis': '交易论点',
  'tradelog.column.mtComment': 'MT备注',

  
  
  
  'dashboard.title': '仪表盘',
  'dashboard.empty.message': '没有可用的交易数据',
  'dashboard.empty.submessage':
    '导入以往交易即可查看表现，或者手动记录一笔新交易。',
  'dashboard.empty.import-action': '导入现有交易',
  'dashboard.empty.manual-action': '手动添加交易',
  'dashboard.empty.filter-hint': '尝试调整筛选设置',
  'dashboard.error.load-failed': '加载数据失败',
  'dashboard.no-data': '没有可用的交易数据',
  'dashboard.button.add-widget': '添加组件',
  'dashboard.button.save-layout': '保存布局',
  'dashboard.button.edit-layout': '编辑布局',

  
  'dashboard.metrics.netPnL': '净盈亏',
  'dashboard.metrics.incl-unrealized': '含 {value} 未实现',
  'dashboard.metrics.winRate': '胜率',
  'dashboard.metrics.profitFactor': '盈亏比',
  'dashboard.metrics.sharpeRatio': '夏普比率',
  'dashboard.metrics.expectancy': '期望值',
  'dashboard.metrics.numTrades': '总交易数',

  'dashboard.metrics.numWinTrades': '盈利交易数',
  'dashboard.metrics.numLossTrades': '亏损交易数',
  'dashboard.metrics.avgWin': '平均盈利',
  'dashboard.metrics.avgLoss': '平均亏损',
  'dashboard.metrics.totalCommission': '总佣金',
  'dashboard.metrics.totalFees': '总费用',
  'dashboard.metrics.maxDrawdown': 'Max Drawdown',
  'dashboard.metrics.bestDay': '最佳交易日',
  'dashboard.metrics.largestWin': '最大单笔盈利',
  'dashboard.metrics.largestLoss': '最大单笔亏损',
  'dashboard.metrics.longestWinStreak': '最佳连胜',
  'dashboard.metrics.longestLossStreak': '最差连亏',
  'dashboard.metrics.avgHoldTime': '平均持仓时间',
  'dashboard.metrics.avgWinHoldTime': '盈利交易平均持仓时间',
  'dashboard.metrics.avgLossHoldTime': '亏损交易平均持仓时间',
  'dashboard.metrics.avgWinnerHeat': '盈利平均回撤',
  'dashboard.metrics.winnerMaeP90': '盈利 MAE P90',
  'dashboard.metrics.winnerMaeMedian': '盈利 MAE 中位数',
  'dashboard.metrics.avgLossHeat': '亏损平均回撤',
  'dashboard.metrics.winnerAvgMfe': '盈利平均 MFE',
  'dashboard.metrics.loserAvgMfe': '亏损平均 MFE',
  'dashboard.metrics.winnerMfeP90': '盈利 MFE P90',
  'dashboard.metrics.loserMfeP90': '亏损 MFE P90',
  'dashboard.metrics.avgRR': '平均风险回报比(盈亏)',
  'dashboard.metrics.avgRRRiskBased': '平均风险回报比(基于R)',
  'dashboard.avgRR.tooltip.formula': '公式:平均盈利 / 平均亏损',
  'dashboard.avgRR.tooltip.no-conversion':
    '该盈亏型 RR 基于未做外汇转换的混合币种计算,结果可能有误导性。',
  'dashboard.sharpeRatio.tooltip.title': '夏普比率',
  'dashboard.sharpeRatio.tooltip.formula':
    '公式：已平仓交易平均净盈亏 / 已平仓交易净盈亏的样本标准差。无风险利率为 0，且该值未年化。',
  'dashboard.sharpeRatio.tooltip.coverage':
    '基于 {total} 笔已平仓交易中的 {valid} 笔计算',
  'dashboard.sharpeRatio.tooltip.partial-coverage':
    '部分覆盖：{total} 笔已平仓交易中有 {valid} 笔具有有限净盈亏。',
  'dashboard.sharpeRatio.tooltip.no-data':
    '需要至少两笔已平仓交易，且盈亏波动不能为零。',
  'dashboard.sharpeRatio.tooltip.no-conversion':
    '此夏普比率基于未进行外汇转换的混合货币，可能具有误导性。',
  'dashboard.avgRRRiskBased.tooltip.title': '平均风险回报比(基于R)',
  'dashboard.avgRRRiskBased.tooltip.formula': '公式:平均盈利R / 平均亏损R',
  'dashboard.avgRRRiskBased.tooltip.coverage':
    '基于 {total} 笔已平仓交易中的 {valid} 笔风险有效交易计算',
  'dashboard.avgRRRiskBased.tooltip.breakdown':
    '风险有效交易中,盈利:{wins},亏损:{losses}',
  'dashboard.avgRRRiskBased.tooltip.partial-coverage':
    '风险数据覆盖不完整:{total} 笔已平仓交易中仅 {valid} 笔具备有效风险数据。',
  'dashboard.avgRRRiskBased.tooltip.no-data':
    '数据不足,无法计算基于 R 的 RR。请补充止损/风险数据,并确保同时存在有效的盈利和亏损交易。',

  
  'dashboard.conversion.title': '已转换为 {currency}',
  'dashboard.conversion.converted-total': '转换后总计',
  'dashboard.conversion.base': '基础货币:{currency}',

  'dashboard.conversion.using-ecb': '使用ECB汇率({date})',
  'dashboard.conversion.using-broker-pnl':
    'Using broker-provided base-currency P&L for {count} {tradeLabel}',
  'dashboard.conversion.using-manual-rate':
    '对 {count} 笔{tradeLabel}使用手动汇率',
  'dashboard.conversion.partial-warning':
    '⚠ {currencies}的成本/风险无法换算，已被排除',
  'dashboard.conversion.trade-singular': 'trade',
  'dashboard.conversion.trade-plural': 'trades',
  'dashboard.conversion.excluded-warning':
    '⚠ {total} 笔交易中有 {converted} 笔已转换({excluded} 笔已排除:{currencies})',
  'dashboard.conversion.original-pnl': '原始盈亏',
  'dashboard.conversion.converted-pnl': '转换后盈亏',
  'dashboard.conversion.details-label': '货币转换详情',

  'dashboard.top-section.remove-metric': '移除指标',
  'dashboard.top-section.failed-load': '加载指标失败',

  
  'dashboard.filter.date.today': '今天',
  'dashboard.filter.date.yesterday': '昨天',
  'dashboard.filter.date.this-week': '本周',
  'dashboard.filter.date.this-month': '本月',
  'dashboard.filter.date.this-quarter': '本季度',
  'dashboard.filter.date.this-year': '今年',
  'dashboard.filter.date.all-time': '全部时间',
  'dashboard.filter.date.custom': '自定义',
  'dashboard.filter.date.from': '从',
  'dashboard.filter.date.to': '至',

  
  'dashboard.filter.accounts.all': '所有账户',
  'dashboard.filter.accounts.n-selected': '{count} 个账户',
  'dashboard.filter.accounts.select-all': '全选',

  'dashboard.filter.accounts.none-found': '未找到账户',
  'dashboard.filter.accounts.phase-now': '至今',

  

  

  
  'dashboard.filter.tickers.none-found': '未找到交易品种',

  

  
  'dashboard.widgets.daily-performance.title': '每日表现',
  'dashboard.widgets.daily-performance.period-aria': '周期',
  'dashboard.widgets.daily-performance.period-days': '{count} 天',
  'dashboard.widgets.weekday-performance.title': '按星期绩效',
  'dashboard.widgets.weekday-performance.metric-aria': '指标',
  'dashboard.widgets.weekday-performance.metric.net': '净值',
  'dashboard.widgets.weekday-performance.metric.win-rate': '胜率',
  'dashboard.widgets.weekday-performance.metric.trades': '交易数',
  'dashboard.widgets.weekday-performance.tooltip.win-rate':
    '胜率:{rate}({wins}盈 / {losses}亏)',
  'dashboard.widgets.weekday-performance.tooltip.trades': '交易数:{count}',
  'dashboard.widgets.hourly-performance.title': '每小时绩效',
  'dashboard.widgets.hourly-performance.tooltip.trades': '交易数:{count}',
  'dashboard.widgets.hourly-performance.tooltip.win-rate-label': '胜率',
  'dashboard.widgets.hourly-performance.tooltip.win-rate':
    '胜率: {rate} ({wins}胜 / {losses}负)',
  'dashboard.widgets.hourly-performance.bucket-aria': '时间间隔',
  'dashboard.widgets.hourly-performance.bucket-option': '{minutes}分钟',
  'dashboard.widgets.hourly-performance.metric-aria': '指标',
  'dashboard.widgets.hourly-performance.metric.total': '总计',
  'dashboard.widgets.hourly-performance.metric.average': '平均',

  'dashboard.widgets.hourly-performance.metric.total-r': '总R',

  'dashboard.widgets.weekday-performance.tooltip.no-trades': '无交易',
  'dashboard.widgets.setup-performance.title': '策略表现',
  'dashboard.widgets.setup-performance.description': '按策略排名的表现柱状图',
  'dashboard.widgets.setup-performance.empty': '没有策略表现数据',
  'dashboard.widgets.setup-performance.masked-label': '策略',
  'dashboard.widgets.tag-performance.title': '标签表现',
  'dashboard.widgets.tag-performance.description': '按标签排名的表现柱状图',
  'dashboard.widgets.tag-performance.empty': '没有标签表现数据',
  'dashboard.widgets.tag-performance.masked-label': '标签',
  'dashboard.widgets.ticker-performance.title': '标的绩效',
  'dashboard.widgets.ticker-performance.metric-aria': '指标',
  'dashboard.widgets.ticker-performance.view-aria': '视图',
  'dashboard.widgets.ticker-performance.view.best-and-worst': '最佳和最差',
  'dashboard.widgets.ticker-performance.view.best': '最佳 10',
  'dashboard.widgets.ticker-performance.view.worst': '最差 10',
  'dashboard.widgets.ticker-performance.metric.total-pnl': '总盈亏',
  'dashboard.widgets.ticker-performance.metric.total-r': '总R',
  'dashboard.widgets.ticker-performance.metric.win-rate': '胜率',
  'dashboard.widgets.ticker-performance.tooltip.ticker': '标的：{ticker}',
  'dashboard.widgets.ticker-performance.tooltip.trades': '交易数：{count}',
  'dashboard.widgets.ticker-performance.tooltip.win-rate':
    '胜率：{rate}（{wins}胜 / {losses}负）',

  'dashboard.widgets.ticker-performance.empty': '无标的绩效数据',
  'dashboard.widgets.ticker-performance.empty-submessage':
    '没有与当前筛选条件匹配的带标的已平仓交易。',
  'dashboard.widgets.ticker-performance.masked-ticker': '标的',
  'dashboard.widgets.ticker-performance.omitted-count': '已省略：{count}',

  'dashboard.widgets.rollingStats.title': '滚动平均盈亏',
  'dashboard.widgets.rollingStats.period': '周期',
  'dashboard.widgets.rollingStats.trades': '{count} 笔交易',
  'dashboard.widgets.rollingStats.avgWin': '平均盈利',
  'dashboard.widgets.rollingStats.avgLoss': '平均亏损',
  'dashboard.widgets.rollingStats.tooltip.trade': '交易 {label}',

  
  'dashboard.rolling_win_loss.title': '滚动盈亏比',
  'dashboard.rolling_win_loss.period_aria': '周期',
  'dashboard.rolling_win_loss.trades_count': '{count} 笔交易',
  'dashboard.rolling_win_loss.trade_label': '交易 {label}',
  'dashboard.rolling_win_loss.ratio_label': '比率:{ratio}',
  'dashboard.rolling_win_loss.ratio_undefined': '比率:期间内无亏损',
  'dashboard.rolling_win_loss.avg_win_label': '平均盈利:{value}',
  'dashboard.rolling_win_loss.no_losses_band': '无亏损',
  'dashboard.rolling_win_loss.window_not_filled':
    '至少需要 {count} 笔已平仓交易',
  'dashboard.rolling_win_loss.avg_loss_label': '平均亏损:{value}',

  
  'dashboard.selector.title': '添加到仪表盘',
  'dashboard.selector.subtitle':
    '通过预览浏览图表和指标，点击即可添加到仪表盘。',
  'dashboard.selector.tab.performance': '表现',
  'dashboard.selector.tab.breakdowns': '细分',
  'dashboard.selector.tab.risk': '风险与分析',
  'widget-drawer.tab.all': '全部',
  'widget-drawer.search.placeholder': '搜索小组件',
  'widget-drawer.section.available': '可添加',
  'widget-drawer.section.in-use': '使用中',
  'widget-drawer.empty-search': '没有与搜索匹配的小组件',
  'widget-drawer.added-count': '已添加 {count}',
  'widget-drawer.add-aria': '添加 {name}',
  'widget-drawer.remove': '移除',
  'widget-drawer.remove-aria': '移除 {name}',
  'widget-drawer.close': '关闭',
  'dashboard.selector.metrics': '指标',

  
  
  
  'filter.modal.no-setup': '无策略',
  'filter.modal.no-tags': '无标签',
  'filter.modal.no-mistakes': '无错误',
  'filter.modal.type.regular': '常规',
  'filter.summary.regular-trades': '常规交易',
  'filter.modal.type.backtest': '回测',
  'filter.modal.status.breakeven': '保本',

  'filter.modal.review-status.reviewed': 'Reviewed',
  'filter.modal.review-status.unreviewed': 'Unreviewed',
  'filter.modal.direction.long-call': '做多/Call',
  'filter.modal.direction.short-put': '做空/Put',
  'filter.modal.section.custom-fields': 'Custom Fields',
  'filter.modal.custom-field.none-available': 'No values available',

  
  
  
  'shared.collapsible.active-filters': '已激活 {count} 个筛选',
  'shared.filter.disabled-preview': '预览中已禁用筛选',
  'shared.filter.open': '打开筛选',
  'shared.filter.active-count': '已激活 {count} 个筛选',

  
  
  

  'view.dashboard': '仪表盘',
  'view.trade-log': '交易日志',
  'view.account-dashboard': '账户',
  'view.layout-builder': '布局编辑器',
  'view.csv-import': 'Trade Import',
  'view.economic-calendar.title': '经济日历',
  'view.economic-calendar.this-week': '本周',
  'view.economic-calendar.sync.aria': '打开财经日历设置',
  'view.economic-calendar.import-count.one': '导入 {count} 个事件',
  'view.economic-calendar.import-count.few': '导入 {count} 个事件',
  'view.economic-calendar.import-count.many': '导入 {count} 个事件',
  'view.economic-calendar.import-count.other': '导入 {count} 个事件',
  'view.economic-calendar.imported': '已导入',
  'view.economic-calendar.update-available': '有可用更新',
  'view.economic-calendar.filter.currency': '货币',
  'view.economic-calendar.filter.impact': '影响',
  'view.economic-calendar.impact.high': '高',
  'view.economic-calendar.impact.medium': '中',
  'view.economic-calendar.impact.low': '低',
  'view.economic-calendar.impact.none': '无',
  'view.economic-calendar.pro-required': '经济日历需要 Journalit Pro',
  'view.economic-calendar.error.offline': '离线时无法加载经济日历。',
  'view.economic-calendar.error.generic': '无法加载经济日历。',
  'view.economic-calendar.empty': '本周没有经济事件。',
  'view.economic-calendar.refresh': '刷新事件',
  'view.economic-calendar.retry': '重试',
  'view.economic-calendar.select-all': '全选',
  'view.economic-calendar.select-aria': '选择 {event}',
  'view.economic-calendar.impact-aria': '影响：{impact}',
  'view.economic-calendar.all-day': '全天',
  'view.economic-calendar.holiday-aria': '假期',
  'view.economic-calendar.forecast': '预测',
  'view.economic-calendar.previous': '前值',
  'view.economic-calendar.actual': '实际',
  'view.economic-calendar.import-success':
    '已导入 {imported} 个，已更新 {updated} 个',
  'view.economic-calendar.import-failed': '无法导入这些事件。',
  'view.economic-calendar.restore-missing-events': '恢复缺失事件（{count}）',
  'economicCalendar.guide.main.intro.description':
    '在这里查看完整一周。Journalit 也可以自动更新你的每周复盘，因此手动导入并非必需。',
  'economicCalendar.guide.main.filters.title': '这些筛选条件只影响当前日历',
  'economicCalendar.guide.main.filters.description':
    '货币和影响级别筛选只会缩小这里显示和可选的事件范围，不会更改自动导入规则。',
  'economicCalendar.guide.main.settings.title': '在设置中配置自动导入',
  'economicCalendar.guide.main.settings.description':
    '使用此按钮选择货币、影响级别和假期，然后启用自动导入。Journalit 会将本周事件同步到每周复盘并刷新已导入的数据，同时不会重新添加你主动删除的事件。',
  'economicCalendar.guide.main.manual-import.title': '手动导入是可选操作',
  'economicCalendar.guide.main.manual-import.description':
    '选择当前显示的行并使用“导入事件”进行一次性导入。启用自动导入后，无需每周手动操作。',
  'economicCalendar.guide.main.restore.title': '恢复缺失的已配置事件',
  'economicCalendar.guide.main.restore.description':
    '如果已保存的自动导入范围中有事件缺失，此按钮将变为可用。当本周事件重新完整后，该按钮仍会显示，但会被禁用。',
  'economicCalendar.guide.main.summary.title': '设置一次，之后只需复盘',
  'economicCalendar.guide.main.summary.description':
    '配置自动导入后，每周复盘会保持完整。你可以回到这里浏览、执行一次性导入或恢复缺失事件。',
  'view.economic-calendar.pro-benefit': '将高影响事件加入周记。',
  'view.economic-calendar.pro-benefit-trial': '从 14 天免费试用开始。',
  'view.economic-calendar.sign-in': '已是 Pro？登录',
  'settings.economic-calendar.title': '财经日历',
  'settings.economic-calendar.description':
    '自动将本周财经事件导入周记的关键事件。',
  'settings.economic-calendar.auto-import': '自动导入本周事件',
  'settings.economic-calendar.auto-import-desc':
    '让当前周记与日历数据保持同步。',
  'settings.economic-calendar.currencies': '货币',
  'settings.economic-calendar.currencies-desc':
    '仅导入这些货币的事件；不选则包含全部。',
  'settings.economic-calendar.impacts': '影响级别',
  'settings.economic-calendar.impacts-desc': '导入具有这些影响级别的事件。',
  'settings.economic-calendar.impacts-empty':
    '未选择经济数据发布。如果已启用，仍可导入节假日。',
  'settings.economic-calendar.include-holidays': '包含假期',
  'settings.economic-calendar.include-holidays-desc':
    '将银行假期和央行会议纪要作为全天条目导入。',
  'settings.economic-calendar.open-view': '打开财经日历',
  'settings.economic-calendar.open-view-desc': '查看本周并手动导入事件。',
  'settings.economic-calendar.pro-required': '财经日历需要 PRO 订阅。',

  
  
  
  'common.loading': '加载中...',
  'common.error': '错误',

  'common.warning': '警告',
  'common.info': '信息',
  'common.yes': '是',
  'common.no': '否',
  'common.ok': '确定',

  'common.none': '无',
  'common.all': '全部',
  'common.date': '日期',

  'common.week': '周',
  'common.month': '月',
  'common.year': '年',

  'common.min': '最小',
  'common.max': '最大',
  'common.profit': '盈利',

  'common.trade': '交易',
  'common.trades': '交易',

  
  
  

  
  
  
  'account.edit.modal.update-notes.title': '更新关联笔记?',
  'account.edit.modal.update-notes.message':
    '重命名将把所有引用"{oldName}"的笔记更新为"{newName}"。这是保持数据一致性所必需的。',
  'account.edit.modal.update-notes.yes': '确定(更新笔记)',
  'account.edit.modal.update-notes.no': '保留旧名称',
  'account.edit.modal.update-notes.cancel': '取消操作',

  'account.edit.modal.change-date.title': '更改创建日期',
  'account.edit.modal.change-date.message':
    '您即将将账户"{account}"的创建日期从 {oldDate} 更改为 {newDate}。',
  'account.edit.modal.change-date.warning':
    '这将更新初始入金交易日期,并可能影响账户存续时间计算、月度账单周期以及其他基于日期的指标。',

  'account.edit.modal.change-date.confirm': '更新创建日期',

  'account.edit.modal.change-balance.title': '更改初始余额',
  'account.edit.modal.change-balance.message':
    '您即将将初始余额从 {oldBalance} 更改为 {newBalance}。',

  'account.edit.modal.change-balance.info':
    '这将影响所有的余额计算、盈亏百分比、回撤计算以及完整的交易历史。',
  'account.edit.modal.change-balance.info2':
    '当前账户余额将根据新的初始余额加上所有已记录交易的盈亏进行重新计算。',
  'account.edit.modal.change-balance.info3':
    '此更改可能会显著影响账户指标和历史数据的准确性。请谨慎操作。',
  'account.edit.modal.change-balance.confirm': '更新初始余额',

  'account.edit.modal.delete.title': '删除账户',
  'account.edit.modal.delete.question': '您确定要永久删除账户"{name}"吗?',

  'account.edit.modal.delete.will': '此操作将:',
  'account.edit.modal.delete.item1': '删除所有账户元数据和设置',
  'account.edit.modal.delete.item2': '从所有关联交易中移除账户引用',
  'account.edit.modal.delete.item3': '从笔记中移除自动生成的账户标签',
  'account.edit.modal.delete.delete-associated-trades':
    'Also delete all trades linked to this account from my vault',

  
  
  

  
  'common.select-option': '选择选项',

  'common.other': '其他',
  'common.breakdown': '分析',
  'common.na': '无',
  'common.unknown': '未知',
  'common.unknown-error': '未知错误',
  'common.select-all': '全选',
  'common.n-types': '{count} 种类型',
  'common.select-item': '选择 {item}',
  'common.header': '标题',

  'common.days': '天',
  'common.weeks': '周',
  'common.months': '月',
  'common.years': '年',
  'common.quarter': '季度',
  'common.quarters': '季度',
  'common.best': '最佳',
  'common.worst': '最差',

  'common.statuses': '状态',
  'common.enabled': '已启用',
  'common.disabled': '已禁用',
  'common.color.gray': '灰色',
  'common.color.red': '红色',
  'common.color.orange': '橙色',
  'common.color.yellow': '黄色',
  'common.color.label': '色彩',
  'common.color.default': '默认',
  'common.day.monday': '星期一',
  'common.day.tuesday': '星期二',
  'common.day.wednesday': '星期三',
  'common.day.thursday': '星期四',
  'common.day.friday': '星期五',
  'common.day.saturday': '星期六',
  'common.day.sunday': '星期日',
  'common.day.all-week': '整周',
  'common.month.january': '一月',
  'common.month.february': '二月',
  'common.month.march': '三月',
  'common.month.april': '四月',
  'common.month.may': '五月',
  'common.month.june': '六月',
  'common.month.july': '七月',
  'common.month.august': '八月',
  'common.month.september': '九月',
  'common.month.october': '十月',
  'common.month.november': '十一月',
  'common.month.december': '十二月',
  'common.score.poor': '差',
  'common.score.below-average': '低于平均',
  'common.score.average': '平均',
  'common.score.strong': '强',
  'common.score.excellent': '优秀',
  'common.note-label': '备注:',

  'common.backups-label': '备份:',

  
  'button.done': '完成',
  'button.edit': '编辑',
  'button.reset-to-defaults': '重置为默认值',
  'button.back': '返回',
  'button.maybe-later': '稍后再说',
  'button.upgrade-now': '立即升级',
  'button.apply': '应用',
  'button.remove': '移除',

  'button.move-up': '向上移动',
  'button.move-down': '向下移动',

  'button.next': '下一步',
  'button.discard': '放弃',
  'guide.scroll-to-target.title': '继续引导前请先滚动',
  'guide.scroll-to-target.description':
    '下一步当前不在屏幕内。请滚动后继续，或者让 Journalit 直接带你过去。',
  'guide.scroll-to-target.description-up':
    '下一步在页面更上方。请向上滚动继续，或者让 Journalit 直接带你过去。',
  'guide.scroll-to-target.description-down':
    '下一步在页面更下方。请向下滚动继续，或者让 Journalit 直接带你过去。',
  'guide.scroll-to-target.button': '带我过去',

  
  'templateEditor.loading': '正在加载布局...',
  'templateEditor.mode.preview': '预览',
  'templateEditor.mode.editor': '编辑',
  'templateEditor.built-in-badge': '(内置)',
  'templateEditor.built-in-notice':
    '内置模板无法编辑。请复制此模板或创建新模板进行自定义。',
  'templateEditor.unsaved-changes': '未保存的更改',
  'templateEditor.field.template-name': '布局名称',
  'templateEditor.field.widgets': '组件({count})',
  'templateEditor.button.add-widget': '+ 添加组件',
  'templateEditor.button.widget-library-docs': 'Widget library docs',
  'templateEditor.widget.locked': '已锁定',
  'templateEditor.widget.select-placeholder': '选择组件...',
  'templateEditor.widget.header-text-placeholder': '标题文本...',
  'templateEditor.widget.markdown-zone-text-label': '预设文本',
  'templateEditor.widget.markdown-zone-text-placeholder':
    '插入到新复盘笔记中的文本...',
  'templateEditor.widget.page-size': '页面大小:',
  'templateEditor.widget.show-rating-column': '显示评分列',
  'templateEditor.widget.demon-tracker.tracking-method': '按以下方式追踪错误：',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences':
    '交易出现次数',
  'templateEditor.widget.demon-tracker.tracking-method.trade-occurrences-desc':
    '每笔标记该错误的交易都会计数。',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days': '交易日',
  'templateEditor.widget.demon-tracker.tracking-method.trading-days-desc':
    '交易和每日复盘中的错误会合并，并在每个交易日计数一次。',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries':
    '每日复盘条目',
  'templateEditor.widget.demon-tracker.tracking-method.daily-review-entries-desc':
    '仅统计每日复盘中记录的错误。',
  'templateEditor.widget.demon-tracker.stop-after': '在以下次数后停止交易：',

  
  'builder.sidebar.title': '布局编辑器',
  'builder.sidebar.section.trade': '交易',
  'builder.sidebar.section.drc': '每日报告卡',
  'builder.sidebar.section.weekly': '周度复盘',
  'builder.sidebar.section.monthly': '月度复盘',
  'builder.sidebar.section.quarterly': '季度复盘',
  'builder.sidebar.section.yearly': '年度复盘',
  'builder.sidebar.section.library': '布局库',
  'builder.sidebar.new-item': '新建{title}',
  'builder.sidebar.coming-soon': '敬请期待',
  'builder.sidebar.built-in': '内置',
  'builder.sidebar.default-template': '默认布局',
  'builder.sidebar.set-as-default': '设为默认',
  'builder.sidebar.duplicate': '复制',
  'builder.sidebar.delete': '删除',
  'builder.sidebar.no-templates': '暂无布局',
  'builder.sidebar.share-template': '分享布局',
  'builder.sidebar.new-template-name': '新建{type}布局',
  'builder.sidebar.copy-suffix': '(副本)',

  
  'validation.basic-tab-errors.one': '基本标签页有 {count} 个错误',
  'validation.basic-tab-errors.few': '基本标签页有 {count} 个错误',
  'validation.basic-tab-errors.many': '基本标签页有 {count} 个错误',
  'validation.basic-tab-errors.other': '基本标签页有 {count} 个错误',
  'validation.details-tab-errors.one': '详情标签页有 {count} 个错误',
  'validation.details-tab-errors.few': '详情标签页有 {count} 个错误',
  'validation.details-tab-errors.many': '详情标签页有 {count} 个错误',
  'validation.details-tab-errors.other': '详情标签页有 {count} 个错误',
  'validation.advanced-tab-errors.one': '高级标签页有 {count} 个错误',
  'validation.advanced-tab-errors.few': '高级标签页有 {count} 个错误',
  'validation.advanced-tab-errors.many': '高级标签页有 {count} 个错误',
  'validation.advanced-tab-errors.other': '高级标签页有 {count} 个错误',

  
  'ui.toggle-switch.aria-label': '切换开关',
  'ui.folder-browser.placeholder': '选择文件夹...',
  'ui.folder-browser.root': '根目录',
  'ui.folder-browser.clear-aria': '清空以使用默认位置',
  'ui.folder-browser.expand-folder': '展开文件夹',
  'ui.folder-browser.collapse-folder': '折叠文件夹',

  
  'view.account-page.title': '账户:{name}',
  'view.account-page.title-default': '账户页面',
  'view.account-page.no-account-selected': '未选择账户',
  'view.account-page.no-account-instructions': '请从“账户”打开此页面。',
  'view.account-page.service-loading': '正在加载账户页面服务...',
  'view.account-page.balance-chart-title': '账户余额图表',
  'view.account-page.balance-chart-loading': '正在加载余额图表...',

  
  'form.modal.unsaved-changes.title': '未保存的更改',
  'form.modal.unsaved-changes.body1': '您在交易表单中有未保存的更改。',
  'form.modal.unsaved-changes.body2': '确定要关闭而不保存吗?',
  'form.modal.unsaved-changes.continue': '继续编辑',
  'form.modal.unsaved-changes.discard': '放弃更改',
  'form.section.custom-fields': '自定义字段',

  'form.section.custom-fields-empty-title': '还没有高级字段。',
  'form.section.custom-fields-empty-desc':
    '记录内置字段未涵盖的任何内容，例如交易时段、周期或形态评级。自定义字段会随每笔交易一起保存，并可成为交易记录中可排序的列。',
  'form.section.attachments': '附件',
  'form.field.asset-type.stock': '股票',
  'form.field.asset-type.options': '期权',
  'form.field.asset-type.futures': '期货',
  'form.field.asset-type.forex': '外汇',
  'form.field.asset-type.crypto': '加密货币',
  'form.field.asset-type.cfd': '差价合约',

  'form.field.closed': '已平仓',
  'form.field.incl-costs': '(含费用)',
  'form.field.commission-type.fixed': '固定',
  'form.field.commission-type.percentage': '百分比(%)',
  'form.calculated': '已计算',
  'form.account-empty-state.title': '设置你的第一个账户',
  'form.account-empty-state.description':
    '账户用于记录余额，让 Journalit 能够计算收益、风险和回撤。创建账户只需要一个名称。',
  'form.account-empty-state.create-account': '创建账户',
  'form.account-empty-state.submit-disabled': '请先创建账户,再保存这笔交易。',
  'form.field.option-type': '期权类型',
  'form.empty.take-profits': 'No take profit targets yet',
  'form.action.add-take-profit': 'Add Take Profit',
  'form.action.remove-take-profit': 'Remove take profit',
  'form.field.option-type.call': '看涨期权',
  'form.field.option-type.put': '看跌期权',
  'form.field.image-url-placeholder': '粘贴图片 URL 或文件路径...',
  'form.field.image-duplicate-error': '此图片已添加。',
  'form.field.trade-image-alt': '交易图片',

  'form.field.value-dollar': '价值($)',
  'form.field.dollar-amount-placeholder': '美元金额',
  'form.field.direct-pnl-placeholder': '输入总盈利或亏损',

  'form.field.mae-placeholder-currency': 'Max drawdown in {currency}',
  'form.field.mfe-placeholder-currency': 'Max profit in {currency}',
  'form.error.image-upload-unavailable': '图片上传不可用',
  'trade.header.unknown-instrument': '未知品种',

  

  
  'modal.template-switch.title': '切换模板?',
  'modal.template-switch.switching-from': '从',
  'modal.template-switch.switching-to': '切换到',
  'modal.template-switch.has-content-title': '此笔记有内容',
  'modal.template-switch.has-content-desc': '切换模板将替换当前内容。',
  'modal.template-switch.cannot-undo': '此操作无法撤销(但您可以切换回来)。',
  'modal.template-switch.button.switch': '切换模板',

  
  'status-bar.update-available-branded': '更新 Journalit',
  'status-bar.release-notes-branded': 'Journalit · 查看更新日志',
  'status-bar.update-aria-label': 'Journalit {version} - 点击查看',
  'update.available.ready': '已有新版本',

  
  'template.transformation.orphaned-content.header': '来自旧模板的内容',
  'template.transformation.orphaned-content.desc1':
    '以下内容未能适配新的模板布局。',
  'template.transformation.orphaned-content.desc2':
    '请在上方检查并整合,或在不需要时删除。',

  
  'template.editor.loading': '正在加载模板...',
  'template.editor.built-in': '内置',
  'template.editor.unsaved-changes': '未保存的更改',

  'template.editor.built-in-notice':
    '内置模板无法编辑。请复制此模板或创建新模板进行自定义。',

  'template.editor.show-review-desc': '设置何时在交易笔记中显示复盘区块',

  'template.editor.section-visibility': '区块可见性',
  'template.editor.trade-note-layout': '交易笔记布局',

  'template.editor.other-asset-types': '其他',

  'template.editor.asset-type-add': '资产类型',

  'template.editor.remove-asset-layout': '移除资产布局',

  'template.editor.metrics': '指标',
  'template.editor.metrics-desc': '显示入场、出场、持续时间和计划指标卡片',
  'template.editor.thesis': '交易论点',
  'template.editor.thesis-desc': '显示交易论点区块',
  'template.editor.metric-cards': '指标卡片',
  'template.editor.missed-reason': '错过交易原因',
  'template.editor.missed-reason-desc': '显示为什么没有执行这笔错过的交易',
  'template.editor.metadata-rows': '元数据行',
  'template.editor.accounts': '账户',
  'template.editor.setups': '设置',
  'template.editor.mistakes': '错误',
  'template.editor.tags': '标签',
  'template.editor.custom-fields': '自定义字段',
  'template.editor.custom-fields-desc': '已配置 {count} 个自定义字段',

  'template.editor.metric.position-size': '持仓大小',
  'template.editor.metric.execution-breakdown': '执行明细',
  'template.editor.metric.pnl': '盈亏',
  'template.editor.metric.r-multiple': 'R 倍数',
  'template.editor.metric.costs': '成本',
  'template.editor.nav-bar': '导航栏',
  'template.editor.nav-bar-desc': '显示交易时间线与复盘链接',
  'template.editor.images': '图片',
  'template.editor.images-desc': '显示交易图表图片',
  'template.editor.metadata': '元数据',
  'template.editor.metadata-desc': '显示账户、交易设置和失误',

  'template.editor.review-button': '标记已复盘按钮',
  'template.editor.review-button-desc': '显示用于标记交易已复盘的按钮',

  
  'ribbon.open-journalit': '打开 Journalit',

  
  'notice.error.missed-trade-service-init':
    '错失交易服务未初始化。请稍候片刻后重试。',
  'notice.error.backtest-trade-service-init':
    '回测交易服务未初始化。请稍候片刻后重试。',
  'notice.trade-updated': '{type}已更新:{path}',
  'notice.trade-created': '{type}已创建:{path}',
  'notice.new-trade-created': '📈 新交易已创建:{instrument} {direction}',
  'notice.error.trade-update-failed': '更新{type}失败:{error}',
  'notice.error.trade-create-failed': '创建{type}失败:{error}',
  'notice.template-applied': '已应用布局:{name}',

  'notice.csv-template-deleted': '模板"{name}"已删除',
  'notice.csv-template-delete-failed': '删除模板失败:{error}',
  'notice.csv-template-imported': '模板"{name}"导入成功',
  'notice.csv-symbol-mappings-created.one': '已创建{count}个代码映射',
  'notice.csv-symbol-mappings-created.few': '已创建{count}个代码映射',
  'notice.csv-symbol-mappings-created.many': '已创建{count}个代码映射',
  'notice.csv-symbol-mappings-created.other': '已创建{count}个代码映射',
  'notice.csv-symbol-mapping-skipped': '跳过代码映射',
  'notice.csv-missing-fields': '请在导入前映射所有必填字段',
  'notice.trades-duplicated.one': '已复制{count}笔交易',
  'notice.trades-duplicated.few': '已复制{count}笔交易',
  'notice.trades-duplicated.many': '已复制{count}笔交易',
  'notice.trades-duplicated.other': '已复制{count}笔交易',
  'notice.trades-deleted.one': '已删除{count}笔交易',
  'notice.trades-deleted.few': '已删除{count}笔交易',
  'notice.trades-deleted.many': '已删除{count}笔交易',
  'notice.trades-deleted.other': '已删除{count}笔交易',
  'notice.mark-reviewed.one': '已将{count}笔交易标记为已复盘',
  'notice.mark-reviewed.few': '已将{count}笔交易标记为已复盘',
  'notice.mark-reviewed.many': '已将{count}笔交易标记为已复盘',
  'notice.mark-reviewed.other': '已将{count}笔交易标记为已复盘',

  'notice.error.open-account-dashboard': '打开账户失败：{error}',
  'notice.error.open-trade-form-edit': '打开交易表单编辑模式失败:{error}',
  'notice.error.open-onboarding': '打开新手引导失败。请检查控制台了解详情。',
  'notice.error.open-update-notification': '打开更新通知失败:{error}',
  'notice.error.switch-template-generic': '切换布局失败',

  'notice.error.cannot-change-folder-during-sync':
    '同步进行中无法更改文件夹路径。请等待同步完成。',
  'notice.error.file-not-found': '文件未找到:{path}',
  'notice.plugin-updated': 'Journalit已更新至v{version}!',
  'notice.sync-mapping.updating': '正在为新文件夹路径更新交易同步映射...',
  'notice.sync-mapping.updated': '交易同步映射已成功更新',
  'notice.error.sync-mapping-update-failed':
    '更新交易同步映射失败。请重启插件。',
  'notice.error.template-save-failed': '保存布局失败',
  'notice.default-trade-template-updated': '默认交易模板已更新',
  'notice.trade-template-duplicated': '交易布局已复制',
  'notice.trade-template-deleted': '交易布局已删除',
  'notice.error.create-template': '创建布局失败',
  'notice.error.duplicate-template': '复制布局失败',
  'notice.error.delete-template': '删除布局失败',
  'notice.settings-reset-with-backup':
    '设置已重置为默认值。已创建备份。重启Obsidian以应用所有更改。',
  'notice.settings-reset-no-backup':
    '设置已重置为默认值。未创建备份。重启Obsidian以应用所有更改。',

  
  'error.render-component': '渲染 {component} 时出错:{error}',
  'error.session-expired': '您的会话已过期。请在插件设置中重新登录。',
  'error.ftp-not-found': '未找到FTP账户。系统将自动为您创建一个。',
  'error.no-trading-data':
    '未找到交易数据。请确保您的MetaTrader账户已正确连接且有交易历史。',
  'error.unable-connect-service':
    '无法连接到交易数据服务。请检查您的网络连接。',
  'error.invalid-verification-code': '验证码无效。请检查验证码后重试。',
  'error.invalid-registration-data': '注册数据无效。请检查您的设置后重试。',
  'error.invalid-request': '请求无效。请检查您的输入后重试。',
  'error.access-denied': '访问被拒绝。请检查您的账户权限或联系支持。',
  'error.too-many-requests': '请求过于频繁。请稍候片刻后重试。',
  'error.service-unavailable': '交易数据服务暂时不可用。请稍后重试。',
  'error.server-error': '服务器错误。请稍后重试或如问题持续请联系支持。',
  'error.network-error': '无法连接到交易数据服务。请检查您的网络连接后重试。',
  'error.unknown': '发生未知错误',
  'error.unexpected': '发生意外错误。请重试或如问题持续请联系支持。',
  'error.settings.invalid-pattern':
    '验证模式无效。请检查您的正则表达式后重试。',
  'error.settings.field-name-conflict':
    '此字段名与现有字段冲突。请选择其他名称。',
  'error.settings.invalid-field-name':
    '字段名无效。字段名只能包含字母、数字和下划线。',
  'error.settings.save-failed': '无法保存您的更改。请检查您的设置后重试。',
  'error.settings.load-failed':
    '无法加载自定义字段设置。您的自定义字段可能无法正确显示。',
  'error.settings.import-failed': '无法导入字段设置。请检查文件格式后重试。',
  'error.settings.create-failed': '无法创建自定义字段。请检查您的输入后重试。',
  'error.settings.remove-failed': '无法移除自定义字段。请重试。',
  'error.settings.generic': '管理自定义字段时出错。请检查您的设置后重试。',
  'error.options.duplicate': '此选项已存在。请选择其他名称。',
  'error.options.invalid-ticker':
    '股票代码无效。只能使用字母、数字和句号(例如:AAPL、SPX)。',
  'error.options.add-ticker-failed': '无法添加股票代码。请检查格式后重试。',
  'error.options.add-failed': '无法添加选项。该选项可能已存在或无效。',
  'error.options.update-failed': '无法更新选项。该选项可能已存在或无效。',
  'error.options.remove-failed': '无法移除选项。请重试。',
  'error.options.no-options-reset': '无选项可重置。该类别已为空。',
  'error.options.reset-failed': '无法重置选项。请重试。',
  'error.options.save-failed': '无法保存选项更改。请检查您的设置后重试。',
  'error.options.generic': '管理选项时出错。请重试。',
  'error.clipboard.permission-denied':
    '剪贴板访问被拒绝。请在浏览器中允许剪贴板权限以使用粘贴功能。',
  'error.clipboard.not-supported':
    '您的浏览器不支持剪贴板粘贴。请尝试使用 Ctrl+V 或 Cmd+V。',
  'error.clipboard.image-too-large': '图像过大无法粘贴。请使用小于10MB的图像。',
  'error.clipboard.no-content': '剪贴板中没有内容可粘贴。请先复制一张图像。',
  'error.clipboard.no-images':
    '剪贴板中未找到图像。请确保您复制的是图像而非文本或其他内容。',
  'error.clipboard.network-error':
    '处理粘贴时发生网络错误。请检查您的连接后重试。',
  'error.clipboard.paste-failed':
    '无法完成粘贴操作。请重新复制图像并尝试粘贴。',
  'error.clipboard.generic': '剪贴板操作失败。请重新复制您的内容并尝试粘贴。',

  
  
  

  'datetime.aria.open-picker': '打开日期选择器',

  
  
  

  'datepicker.button.clear': '清除',
  'datepicker.button.today': '今天',
  'datepicker.button.now': '现在',
  'datepicker.placeholder.day': 'DD',
  'datepicker.placeholder.month': 'MM',
  'datepicker.placeholder.year': 'YY',
  'datepicker.placeholder.hour': 'HH',
  'datepicker.placeholder.minute': 'MM',
  'datepicker.placeholder.second': 'SS',

  
  
  
  
  'calendar.day.mon': '一',
  'calendar.day.tue': '二',
  'calendar.day.wed': '三',
  'calendar.day.thu': '四',
  'calendar.day.fri': '五',
  'calendar.day.sat': '六',
  'calendar.day.sun': '日',

  
  'calendar.month.jan': '1月',
  'calendar.month.feb': '2月',
  'calendar.month.mar': '3月',
  'calendar.month.apr': '4月',
  'calendar.month.may': '5月',
  'calendar.month.jun': '6月',
  'calendar.month.jul': '7月',
  'calendar.month.aug': '8月',
  'calendar.month.sep': '9月',
  'calendar.month.oct': '10月',
  'calendar.month.nov': '11月',
  'calendar.month.dec': '12月',

  
  'calendar.month.january': '一月',
  'calendar.month.february': '二月',
  'calendar.month.march': '三月',
  'calendar.month.april': '四月',
  'calendar.month.june': '六月',
  'calendar.month.july': '七月',
  'calendar.month.august': '八月',
  'calendar.month.september': '九月',
  'calendar.month.october': '十月',
  'calendar.month.november': '十一月',
  'calendar.month.december': '十二月',

  
  'calendar.weekday.mon': '周一',
  'calendar.weekday.tue': '周二',
  'calendar.weekday.wed': '周三',
  'calendar.weekday.thu': '周四',
  'calendar.weekday.fri': '周五',
  'calendar.weekday.sat': '周六',
  'calendar.weekday.sun': '周日',

  
  'calendar.legend.less': '更少',
  'calendar.legend.more': '更多',
  'calendar.pnl': '盈亏',
  'calendar.week': '周',
  'calendar.trade': '{count} 笔交易',
  'calendar.trades': '{count} 笔交易',
  'calendar.reviewed': '已复盘',

  
  
  

  
  'account.settings.modal.title': '账户仪表盘设置',
  'account.settings.notice.name-empty': '账户类型名称不能为空',
  'account.settings.notice.type-exists': '账户类型"{name}"已存在',
  'account.settings.notice.reserved-name': '"{name}"是保留的账户类型名称',
  'account.settings.notice.type-added': '账户类型"{name}"添加成功',
  'account.settings.notice.add-error': '添加账户类型时出错:{error}',
  'account.settings.notice.cannot-delete-archived':
    '无法删除"已归档"账户类型 - 该类型用于归档账户',
  'account.settings.notice.analyze-error': '分析账户类型使用情况时出错',
  'account.settings.notice.cannot-delete-has-accounts':
    '无法删除"{name}" - 该类型有{count}个关联账户。迁移功能即将推出。',
  'account.settings.notice.saved': '账户仪表盘设置保存成功',
  'account.settings.notice.save-error': '保存设置时出错:{error}',
  'account.settings.notice.migration-target-required':
    '请选择目标账户类型进行重新分配',
  'account.settings.notice.migration-failed': '迁移失败:{error}',
  'account.settings.notice.type-deleted': '账户类型"{name}"删除成功',
  'account.settings.notice.type-deleted-with-cleanup':
    '账户类型"{name}"删除成功(已清理:{actions})',
  'account.settings.notice.migration-error': '迁移过程中出错:{error}',
  'account.settings.notice.delete-error': '删除账户类型时出错:{error}',
  'account.settings.notice.operation-failed': '{operation}失败:{error}',
  'account.settings.notice.migration-no-targets':
    '无法迁移账户 - 没有其他可用的账户类型。请先创建新的账户类型。',
  'account.settings.notice.type-deleted-migrated':
    '账户类型"{name}"删除成功。{count}个账户{action}',
  'account.settings.operation.type-deletion': '账户类型删除',
  'account.settings.migration.error.target-required': '重新分配需要目标类型',
  'account.settings.migration.error.invalid-option': '无效的迁移选项',
  'account.settings.unnamed-account': '未命名账户',
  'account.settings.migration.title': '删除前迁移账户',
  'account.settings.migration.warning':
    '您即将删除"{name}",该类型有{count}个关联账户。',
  'account.settings.migration.instruction': '删除账户类型前必须处理这些账户:',
  'account.settings.migration.more-accounts': '... 以及{count}个更多账户',
  'account.settings.migration.choose-option': '选择如何处理这些账户:',
  'account.settings.migration.option.reassign.title': '重新分配到其他类型',
  'account.settings.migration.option.reassign.desc':
    '将所有账户移动到其他账户类型',
  'account.settings.migration.target-type.label': '目标账户类型:',
  'account.settings.migration.option.archive.title': '归档账户',
  'account.settings.migration.option.archive.desc':
    '将所有账户移动到"已归档"状态',
  'account.settings.migration.option.delete.title': '标记为删除',
  'account.settings.migration.option.delete.desc': '将所有账户标记为已删除',
  'account.settings.migration.button.migrate': '迁移并删除类型',
  'account.settings.migration.button.migrating': '迁移中...',
  'account.settings.migration.action.reassigned': '已重新分配到"{target}"',
  'account.settings.migration.action.archived': '已移至归档状态',
  'account.settings.migration.action.deleted': '已标记为删除',
  'account.settings.delete.title': '删除账户类型',
  'account.settings.delete.confirm-question': '您确定要删除账户类型"{name}"吗?',
  'account.settings.delete.impact-analysis': '影响分析:',
  'account.settings.delete.affected-accounts': '⚠️ {count}个账户受影响:',
  'account.settings.delete.migration-notice':
    '注意:删除前需要将这些账户重新分配到其他账户类型。',
  'account.settings.delete.no-affected': '✅ 没有账户正在使用此账户类型',
  'account.settings.delete.cleanup-title': '将清理的设置:',
  'account.settings.delete.cleanup.excluded': '✓ 已从排除的账户类型中移除',
  'account.settings.delete.cleanup.order': '✓ 已从显示顺序中移除',
  'account.settings.delete.cleanup.withdrawals': '✓ 已从出金设置中移除',
  'account.settings.delete.cleanup.none': '无需清理设置',
  'account.settings.delete.button.setup-migration': '设置迁移',
  'account.settings.delete.button.delete': '删除账户类型',
  'account.settings.delete.button.deleting': '删除中...',
  'account.settings.section.available-types.title': '可用账户类型',
  'account.settings.section.available-types.desc': '系统中当前的账户类型。',
  'account.settings.section.available-types.placeholder': '输入账户类型名称...',
  'account.settings.section.available-types.add-aria': '添加新账户类型',
  'account.settings.section.available-types.delete-aria': '删除{name}',
  'account.settings.section.available-types.empty': '未定义自定义账户类型。',
  'account.settings.section.challenge-stages.title': '挑战阶段',
  'account.settings.section.challenge-stages.desc':
    '挑战达到该阶段时应用的账户类型。',
  'account.settings.section.challenge-stages.no-change': '不更改',
  'account.settings.section.challenge-stages.aria': '{stage} 的账户类型',
  'account.settings.section.inclusion.title': '仪表盘包含设置',
  'account.settings.section.inclusion.desc':
    '选择要包含在仪表盘计算中的账户类型。同时配置每种账户类型的出金是否计入总出金指标。',
  'account.settings.section.inclusion.include-dashboard': '仪表盘统计',
  'account.settings.section.inclusion.include-withdrawals': '出金',
  'account.settings.section.inclusion.empty': '没有可配置的账户类型。',
  'account.settings.section.order.title': '显示顺序',

  'account.settings.section.order.move-up': '上移',
  'account.settings.section.order.move-down': '下移',
  'account.settings.button.save': '保存设置',
  'account.settings.button.saving': '保存中...',

  
  'account.create.title': '创建账户',
  'account.create.field.name': '账户名称',
  'account.create.field.name-desc': '您的交易账户的唯一名称',
  'account.create.placeholder.name': '我的交易账户',
  'account.create.field.type': '账户类型',
  'account.create.field.type-desc': '交易账户的类型',
  'account.create.field.initial-balance': '初始余额',
  'account.create.field.initial-balance-desc': '账户起始余额（可选，默认为0）',
  'account.create.field.live-balance': '实时余额',
  'account.create.field.live-balance-desc':
    '当前经纪商余额，不会创建现金流记录',
  'account.create.field.creation-date': '创建日期',
  'account.create.field.creation-date-desc': '账户创建时间',
  'account.create.field.currency': '币种',
  'account.create.field.currency-desc': '账户用于显示的本位币',
  'account.create.field.drawdown-type': '回撤类型',

  'account.create.field.drawdown-amount': '回撤金额',
  'account.create.field.drawdown-amount-desc': '最大回撤限额',
  'account.create.field.profit-target-desc': '为账户设置盈利目标',
  'account.create.field.monthly-cost': '月度费用',
  'account.create.field.monthly-cost-desc': '订阅费、平台费用',
  'account.create.field.target-type': '目标类型',
  'account.create.field.target-type-desc': '绝对值或百分比',
  'account.create.field.target-percent': '目标 (%)',
  'account.create.field.target-dollar': '目标 ($)',
  'account.create.field.target-percent-desc': '百分比收益目标',
  'account.create.field.target-dollar-desc': '金额目标',
  'account.create.field.target-date': '目标日期(可选)',
  'account.create.field.target-date-desc': '达成盈利目标的日期',
  'account.create.type.demo': '模拟',
  'account.create.type.evaluation': '评估',
  'account.create.type.funded': '实盘',
  'account.create.success': '账户"{name}"创建成功',
  'account.create.error.name-required': '账户名称为必填项',
  'account.create.error.name-exists': '名为"{name}"的账户已存在',
  'account.create.error.rule-incomplete': '每条启用的规则都需要大于零的数值',
  'account.create.error.balance-negative': '初始余额不能为负数',
  'account.create.error.invalid-live-balance': '实时余额无效',
  'account.create.error.drawdown-required': '启用回撤类型时必须填写回撤金额',
  'account.create.error.profit-target-required':
    '启用盈利目标时必须填写目标金额',
  'account.create.error.invalid-date': '创建日期无效',
  'account.create.error.future-date': '创建日期不能是未来日期',
  'account.create.error.cost-negative': '月度费用不能为负数',
  'account.create.error.service-unavailable': '账户服务不可用,请重试。',
  'account.create.error.fix-target-date': '请先修正盈利目标日期错误再创建账户',
  'account.create.error.invalid-target-date': '盈利目标日期无效',
  'account.create.error.failed': '创建账户失败:{error}',
  'account.create.button.creating': '创建中...',
  'account.create.button.create': '创建账户',

  
  'account.edit.title': '编辑账户',
  'account.edit.convert.discard-title': '放弃未保存的更改？',
  'account.edit.convert.discard-message':
    '挑战设置会在单独的窗口中打开并关闭此表单。此处的更改不会被保存。',
  'account.edit.convert.discard-confirm': '放弃并继续',
  'account.edit.field.name': '账户名称',
  'account.edit.field.name-desc': '此账户的唯一名称',
  'account.edit.placeholder.name': '例如:我的交易账户',
  'account.edit.field.type': '账户类型',
  'account.edit.field.type-desc': '交易账户类型',
  'account.edit.type.demo': '模拟',
  'account.edit.type.evaluation': '评估',
  'account.edit.type.funded': '实盘',
  'account.edit.field.initial-balance': '初始余额',
  'account.edit.field.initial-balance-desc': '账户起始余额',
  'account.edit.field.live-balance': '实时余额',
  'account.edit.field.live-balance-desc': '当前经纪商余额，不会创建现金流记录',
  'account.edit.field.creation-date': '创建日期',
  'account.edit.field.creation-date-desc': '账户创建时间',
  'account.edit.field.currency': '币种',
  'account.edit.field.currency-desc': '账户用于显示的本位币',
  'account.edit.field.drawdown-type': '回撤类型',

  'account.edit.field.drawdown-amount': '回撤金额',
  'account.edit.field.drawdown-amount-desc': '从初始余额计算的最大允许亏损',
  'account.edit.field.manual-snapshots': '手动回撤快照',
  'account.edit.field.manual-snapshots-desc':
    '管理每日余额快照用于每日收盘追踪回撤计算',
  'account.edit.field.profit-target-desc': '为账户设置盈利目标',
  'account.copy-trading.title': 'Copy Trading',
  'account.copy-trading.description':
    'Derive this account’s performance from another account using historical copy periods.',
  'account.copy-trading.enable': 'This account copies another account',
  'account.copy-trading.existing-trades-warning':
    'This account already has direct trades. They will remain, and copied trades will be added from the selected start date.',
  'account.copy-trading.base-account': 'Base Account',
  'account.copy-trading.base-account-desc':
    'Only same-currency non-copy accounts can be selected.',
  'account.copy-trading.base-account-placeholder': 'Select base account',
  'account.copy-trading.multiplier': 'Multiplier',
  'account.copy-trading.multiplier-desc': 'Allowed range: 0.1x to 100x',
  'account.copy-trading.all-history': 'Copy all historical trades',
  'account.copy-trading.start-date': 'Copy From Date',
  'account.copy-trading.history': 'Copy history',
  'account.copy-trading.error.base-required':
    'Select a base account for copy trading.',
  'account.copy-trading.error.multiplier-range':
    'Copy trading multiplier must be between 0.1x and 100x.',
  'account.copy-trading.error.start-date-required':
    'Select a copy trading start date.',
  'account.edit.field.monthly-cost': '月度费用',
  'account.edit.field.monthly-cost-desc': '订阅费、平台费用',
  'account.copy-trading.error.base-account-is-copied':
    'This account is already used as a base account and cannot copy another account.',
  'account.copy-trading.base-account-is-copied-desc-primary':
    'This account is currently the base for another copy account.',
  'account.copy-trading.base-account-is-copied-desc-secondary':
    'Base accounts cannot also be copy accounts.',
  'account.prop-challenge.summary.status.archived': '已归档',
  'account.prop-challenge.summary.status.hidden': '已隐藏',
  'account.prop-challenge.actions.progress-to': '进入{phase}',
  'account.prop-challenge.actions.progress': '进入下一阶段',
  'account.prop-challenge.actions.mark-passed': '标记挑战通过',
  'account.prop-challenge.actions.mark-failed': '标记为失败',
  'account.prop-challenge.actions.archive': '归档挑战',
  'account.prop-challenge.actions.reopen': '重新打开',
  'account.prop-challenge.actions.link-rules': '关联机构规则…',
  'account.prop-challenge.view-trades': '查看 {phase} 的交易',
  'account.prop-challenge.actions.manual': '手动操作',
  'account.prop-challenge.notice.failed-title': '{phase} 未通过',
  'account.prop-challenge.notice.failed-description': '{date} 违反了{rule}',
  'account.prop-challenge.notice.failed-manual': '已标记为未通过',
  'account.prop-challenge.notice.keep-open': '保持开启',
  'account.prop-challenge.notice.target-title': '已达到 {phase} 目标',
  'account.prop-challenge.notice.target-description':
    '已满足所有通过条件。进入 {next}？',
  'account.prop-challenge.notice.breach-after-reached':
    '在 {time} 达到目标后规则被打破。请设置过渡时间，以便这些交易不计入本阶段。',
  'account.prop-challenge.notice.not-yet': '暂不',
  'account.prop-challenge.notice.passed-title': '考核已通过',
  'account.prop-challenge.notice.passed-description':
    '已满足所有条件。将挑战标记为通过？',
  'account.prop-challenge.notice.payout-title': '可出金：{amount}',
  'account.prop-challenge.notice.payout-plan': '你的计划：出金 {amount}',
  'account.prop-challenge.notice.record-payout': '记录出金',
  'account.prop-challenge.notice.skip-cycle': '跳过本周期',
  'account.prop-challenge.notice.payout-description': '出金',
  'account.prop-challenge.notice.lost-title': '出金资格已失效',
  'account.prop-challenge.notice.lost-description': '未满足：{requirements}',
  'account.prop-challenge.notice.dismiss': '忽略',
  'account.prop-challenge.notice.unknown-title': '新账户 {label}',
  'account.prop-challenge.notice.unknown-description':
    '自 {date} 起有 {count} 笔交易未分配到阶段。',
  'account.prop-challenge.notice.unknown-description-one':
    '自 {date} 起有 1 笔交易未分配到任何阶段。',
  'account.prop-challenge.notice.same-phase': '同一阶段',
  'account.prop-challenge.notice.not-now': '稍后再说',
  'account.prop-challenge.notice.error': '无法更新提醒。',
  'account.prop-challenge.notice.type-changed': '账户类型已设为 {accountType}',
  'account.prop-challenge.payout.plan.title': '出金计划',
  'account.prop-challenge.payout.plan.notify-minimum':
    '可出金不少于时提醒（{currency}）',
  'account.prop-challenge.payout.plan.withdrawal': '建议出金',
  'account.prop-challenge.payout.plan.full': '全部金额',
  'account.prop-challenge.payout.plan.percent': '可出金的百分比',
  'account.prop-challenge.payout.plan.amount': '固定金额',
  'account.prop-challenge.payout.plan.percent-invalid':
    '请输入 1 到 100 之间的百分比。',
  'account.prop-challenge.payout.plan.amount-invalid': '请输入大于零的金额。',
  'account.prop-challenge.payout.plan.percent-value': '百分比',
  'account.prop-challenge.payout.plan.amount-value': '金额（{currency}）',
  'account.prop-challenge.payout.plan.save': '保存计划',
  'account.prop-challenge.payout.plan.saved': '出金计划已保存。',
  'account.prop-challenge.payout.plan.summary-notify': '≥ {amount} 时提醒',
  'account.prop-challenge.payout.plan.summary-percent': '建议 {percent}%',
  'account.prop-challenge.payout.plan.summary-amount': '建议 {amount}',
  'account.prop-challenge.payout.plan.summary-full': '全额',
  'account.prop-challenge.actions.error': '无法更新道具公司挑战。',
  'account.prop-challenge.confirm.advance': '确认此阶段结果并继续挑战？',
  'account.prop-challenge.confirm.advance-with-promotion':
    'This will advance the challenge and change the account type to {accountType}.',
  'account.prop-challenge.confirm.fail':
    '将 {account} 标记为失败？挑战“{challenge}”将在{phase}结束。',
  'account.prop-challenge.confirm.archive-failed':
    '归档 {account}？挑战“{challenge}”已失败。账户将移至已归档。',
  'account.prop-challenge.confirm.archive-passed':
    '归档 {account}？挑战“{challenge}”已通过。账户将移至已归档。',
  'account.prop-challenge.transition.route': '{account} · {from} → {to}',
  'account.prop-challenge.transition.route-passed':
    '{account} · {from} → 挑战通过',
  'account.prop-challenge.confirm.reopen':
    '重新打开 {account}？挑战“{challenge}”将回到{phase}。',
  'account.prop-challenge.transition.time': '过渡时间',
  'account.prop-challenge.transition.now': '现在',
  'account.prop-challenge.transition.when-target-reached': '达到目标时',
  'account.prop-challenge.transition.too-early':
    '过渡时间不能早于该阶段的开始时间。',
  'account.prop-challenge.costs.title': '一次性费用',
  'account.prop-challenge.costs.description': '单独记录购买、重置和激活费用。',
  'account.prop-challenge.costs.kind': '类型',
  'account.prop-challenge.costs.kind.purchase': '购买',
  'account.prop-challenge.costs.kind.reset': '重置',
  'account.prop-challenge.costs.kind.activation': '激活',
  'account.prop-challenge.costs.kind.other': '其他',
  'account.prop-challenge.costs.date': '日期',
  'account.prop-challenge.costs.amount': '金额',
  'account.prop-challenge.costs.note': '备注（可选）',
  'account.prop-challenge.costs.add': '添加费用',
  'account.header.copies': '复制自',
  'account.header.copied-by-more': '+{count} 个',
  'account.header.created': '创建于：',
  'account.summary.current-balance': '当前余额',
  'account.summary.net-cash-flow': '净现金流',
  'account.summary.payouts': '出金',
  'account.performance.title': '绩效表现',
  'account-page.guide.whats-new.cockpit.intro.title': '你的挑战规则',
  'account-page.guide.whats-new.cockpit.intro.description':
    '在交易考核账户中，机构的每条规则以及你离它有多近都显示在指标下方。',
  'account-page.guide.whats-new.cockpit.cockpit.title': '查看阶段并操作',
  'account-page.guide.whats-new.cockpit.cockpit.description':
    '在规则标题中选择一个阶段以查看其规则。可通过旁边的 ⋮ 菜单将其标记为通过或失败，或重新打开。',
  'account-page.guide.main.challenge.title': '一眼掌握挑战进度',
  'account-page.guide.main.challenge.description':
    '选择一个阶段，查看每条规则及其进度。带有已验证分润出金规则的资金阶段也会在这里跟踪出金资格。',
  'account.edit.field.target-type': '目标类型',
  'account.edit.field.target-type-desc': '绝对值或百分比',
  'account.edit.field.target-percent': '目标 (%)',
  'account.edit.field.target-dollar': '目标 ($)',
  'account.edit.field.target-percent-desc': '百分比收益目标',
  'account.edit.field.target-dollar-desc': '金额目标',
  'account.edit.field.target-date': '目标日期(可选)',
  'account.edit.field.target-date-desc': '达成盈利目标的日期',
  'account.edit.button.show-snapshots': '显示快照管理器(已记录 {count} 条)',
  'account.edit.button.hide-snapshots': '隐藏快照管理器(已记录 {count} 条)',
  'account.edit.delete-warning': '此操作不可撤销!',
  'account.edit.button.saving': '保存中...',
  'account.edit.button.save': '保存更改',
  'account.edit.button.delete': '删除账户',
  'account.edit.button.delete-name': '删除"{name}"',
  'account.edit.error.name-required': '账户名称为必填项',
  'account.edit.error.name-exists': '账户"{name}"已存在',
  'account.edit.error.creation-date-required': '创建日期为必填项',
  'account.edit.error.balance-required': '初始余额不能为负数',
  'account.edit.error.invalid-live-balance': '实时余额无效',
  'account.edit.error.drawdown-required': '回撤金额必须大于0',
  'account.edit.error.future-date': '创建日期不能是未来日期',
  'account.edit.error.update-failed': '更新账户失败:{error}',
  'account.edit.error.service-unavailable': '账户服务不可用',
  'account.edit.error.delete-failed': '删除账户失败:{error}',
  'account.edit.success.updated': '账户"{name}"更新成功',
  'account.edit.success.updated-with-references':
    '账户已从"{oldName}"更新为"{newName}",所有笔记引用已同步更新',
  'account.edit.success.deleted': '账户"{name}"删除成功',

  
  'account.add-event.title': '添加入金/出金',
  'account.add-event.field.type': '交易记录类型',
  'account.add-event.field.type-desc': '入金或出金',
  'account.add-event.field.amount': '金额',
  'account.add-event.field.amount-desc': '金额({currency})',
  'account.add-event.field.date': '日期',
  'account.add-event.field.date-desc': '交易记录日期',
  'account.add-event.field.description': '描述(可选)',
  'account.add-event.field.description-desc': '备注信息',
  'account.add-event.type.deposit': '入金',
  'account.add-event.type.withdrawal': '出金',
  'account.add-event.placeholder.deposit': '手动入金',
  'account.add-event.placeholder.withdrawal': '手动出金',
  'account.add-event.button.add': '添加交易记录',
  'account.add-event.button.adding': '添加中...',
  'account.add-event.success': '已成功添加{type} {amount}',
  'account.add-event.error.amount-required': '金额必须大于0',
  'account.add-event.error.date-required': '日期为必填项',
  'account.add-event.error.invalid-date': '日期格式无效',
  'account.add-event.error.future-date': '交易记录日期不能是未来日期',
  'account.add-event.error.failed': '添加交易记录时出错:{error}',
  'account.add-event.confirm.title': '确认交易记录',
  'account.add-event.confirm.message':
    '确定要在{date}向账户"{account}"添加{type} {amount}吗?',
  'account.add-event.confirm.description': '描述:{description}',

  
  'account.edit-event.title': '编辑{type}',
  'account.edit-event.field.type': '交易记录类型',
  'account.edit-event.field.type-desc': '编辑时不可更改',
  'account.edit-event.field.amount': '金额',
  'account.edit-event.field.amount-desc': '金额({currency})',
  'account.edit-event.field.date': '日期',
  'account.edit-event.field.date-desc': '交易记录日期',
  'account.edit-event.field.description': '描述(可选)',
  'account.edit-event.field.description-desc': '备注信息',
  'account.edit-event.button.save': '保存更改',
  'account.edit-event.button.saving': '保存中...',
  'account.edit-event.button.delete': '删除{type}',
  'account.edit-event.button.deleting': '删除中...',
  'account.edit-event.success.update': '{type}更新成功',
  'account.edit-event.success.delete': '{type}删除成功',
  'account.edit-event.error.update': '更新交易记录时出错:{error}',
  'account.edit-event.error.delete': '删除交易记录时出错:{error}',
  'account.edit-event.delete-confirm.title': '删除{type}',
  'account.edit-event.delete-confirm.message':
    '确定要删除{date}的这笔{type}({amount})吗?',
  'account.edit-event.delete-confirm.warning': '此操作无法撤销。',

  
  'account.header.title': '账户:{name}',
  'account.header.back-to-dashboard': '返回仪表板',
  'account.header.add-event.aria': '添加入金/出金',
  'account.header.edit-account.aria': '编辑账户',
  'account.header.view-trades.aria': 'View trades in Trade Log',
  'account.header.type': '类型:',
  'account.header.initial-balance': '初始余额:',
  'account.header.current-balance': '当前余额:',
  'account.header.account-id': '账户ID:',
  'account.header.warning.trades-before-creation.one':
    '发现{count}笔交易在账户创建日期之前',
  'account.header.warning.trades-before-creation.few':
    '发现{count}笔交易在账户创建日期之前',
  'account.header.warning.trades-before-creation.many':
    '发现{count}笔交易在账户创建日期之前',
  'account.header.warning.trades-before-creation.other':
    '发现{count}笔交易在账户创建日期之前',
  'account.header.warning.trades-before-phase.one':
    '发现{count}笔交易在第一阶段开始之前',
  'account.header.warning.trades-before-phase.few':
    '发现{count}笔交易在第一阶段开始之前',
  'account.header.warning.trades-before-phase.many':
    '发现{count}笔交易在第一阶段开始之前',
  'account.header.warning.trades-before-phase.other':
    '发现{count}笔交易在第一阶段开始之前',
  'account.header.warning.earliest-trade-phase':
    '最早交易日期:{date}。阶段开始之前的交易不计入挑战。',
  'account.header.notice.phase-start-updated': '第一阶段开始时间已更改为{date}',
  'account.header.warning.earliest-trade':
    '最早交易日期:{date}。这可能导致余额计算不正确。',
  'account.header.warning.fix-phase-start.aria': '修复第一阶段开始时间',
  'account.header.warning.fix-date.aria': '修复账户创建日期',
  'account.header.warning.fixing': '修复中...',
  'account.header.warning.fix-date': '修复日期',
  'account.header.notice.date-updated': '账户创建日期已更新为{date}',
  'account.header.notice.update-failed-log': '更新账户创建日期失败:',
  'account.header.notice.update-failed': '更新日期失败:{error}',

  
  'account.link-modal.title': '检测到新交易账户',
  'account.link-modal.account-id': '账户ID:',
  'account.link-modal.broker': '券商:',
  'account.link-modal.first-seen': '首次发现:',
  'account.link-modal.question': '您希望如何处理此账户?',
  'account.link-modal.option.new': '使用自定义名称创建新账户',
  'account.link-modal.placeholder.custom-name': '例如:FTMO挑战赛',
  'account.link-modal.account-type': '账户类型:',
  'account.link-modal.option.existing': '关联到现有账户',
  'account.link-modal.no-accounts-available': '(无可用账户)',
  'account.link-modal.select-account': '选择账户...',

  'account.link-modal.option.default': '使用默认名称:Account-{id}',
  'account.link-modal.default-name': 'Account-{id}',
  'account.link-modal.button.linking': '关联中...',
  'account.link-modal.notice.select-existing': '请选择一个现有账户',
  'account.link-modal.notice.failed': '关联账户失败:{error}',

  
  'account.risk-metrics.loading': '正在加载风险指标...',
  'account.risk-metrics.title': '风险管理',
  'account.risk-metrics.drawdown-used': 'Drawdown Limit Used',
  'account.risk-metrics.profit-target': '盈利目标',
  'account.risk-metrics.status.breached': '已突破',
  'account.risk-metrics.status.achieved': '已达成',
  'account.risk-metrics.status.in-progress': '进行中',
  'account.risk-metrics.not-set': '未设置',
  'account.risk-metrics.no-drawdown': '未设置回撤限制',
  'account.risk-metrics.no-profit-target': '未设置盈利目标',
  'account.risk-metrics.label.used': '已用:',
  'account.risk-metrics.label.limit': '限制:',
  'account.risk-metrics.label.remaining': '剩余:',
  'account.risk-metrics.label.progress': '进度:',
  'account.risk-metrics.label.target': '目标:',
  'account.risk-metrics.label.target-date': '目标日期:',

  
  'account.type.demo': '模拟账户',
  'account.type.evaluation': '考核账户',
  'account.type.funded': '实盘账户',
  'account.type.archived': '已归档',

  
  'account.drawdown.none': '无',
  'account.drawdown.fixed': '固定',
  'account.drawdown.eod-trailing': '日终追踪',
  'account.drawdown.manual': '手动',

  
  'account.profit-target.enable': '启用盈利目标',
  'account.profit-target.type.absolute': '绝对金额',
  'account.profit-target.type.percentage': '百分比',

  

  'account.linked-trades.setups': '策略',

  
  'account.weight-legend.aria-label': '账户类型分布图例',
  'account.weight-legend.item-aria-label': '{name}:{percent}',

  
  'account.transaction.deposit': '入金',
  'account.transaction.withdrawal': '出金',
  'account.transaction.click-to-edit': '点击编辑或删除此交易',
  'account.transaction.edit-row-label': '编辑或删除此交易：{date}，{amount}',

  
  'account.deposits-withdrawals.title': '入金与出金',
  'account.deposits-withdrawals.empty': '暂无手动入金或出金记录。',
  'account.deposits-withdrawals.empty-sub':
    '点击标题栏的 + 按钮添加您的第一笔交易。',
  'account.deposits-withdrawals.summary':
    '入金 {deposits} · 出金 {withdrawn} · 最近 {date}',
  'account.payouts.title': '分润出金',
  'account.payouts.summary': '{count} 笔出金 · {total} · 最近 {date}',
  'account.payouts.summary-masked': '数值被隐藏时，支付记录同样隐藏',
  'account.payouts.summary-one': '1 笔出金 · {total} · 最近 {date}',
  'account.payouts.empty': '暂无分润出金记录',
  'account.payouts.empty-sub': '点击标题栏的 + 按钮记录一笔出金。',
  'account.ledger.column.date': '日期',
  'account.ledger.column.type': '类型',
  'account.ledger.column.payout': '出金',
  'account.ledger.column.description': '说明',
  'account.ledger.column.amount': '金额',
  'account.ledger.column.balance-after': '结余',

  
  'account.chart.event.added': '账户已添加',
  'account.chart.event.archived': '账户已归档',

  
  'account.balance-chart.drawdown-floor-off-scale':
    '回撤下限 {value}（低 {distance}）',
  'account.balance-chart.profit-target-off-scale':
    '盈利目标 {value}（高 {distance}）',
  'account.balance-chart.empty': '未找到交易',
  'account.balance-chart.empty-sub': '该账户暂无交易活动',

  
  'account.aum-chart.empty': '无账户数据',
  'account.aum-chart.empty-sub': '添加账户以查看资产管理规模历史',

  
  'account-page.error.title': '加载账户出错',
  'account-page.error.not-found': '无法找到账户"{accountName}"的数据',
  'account-page.error.not-found-sub': '请检查账户是否存在，或尝试刷新页面。',
  'account-page.guide.empty.intro.title': 'This page is one account in detail',
  'account-page.guide.empty.intro.description':
    'Use the Account Page to manage one account, record account events, and review the trades linked to it.',
  'account-page.guide.empty.edit-account.title':
    'Edit Account opens the full account settings',
  'account-page.guide.empty.edit-account.description':
    'Use this button to change the account name, type, currency, drawdown rules, profit target, monthly cost, and more.',
  'account-page.guide.empty.add-event.title':
    'Add Event records deposits and withdrawals',
  'account-page.guide.empty.add-event.description':
    'Use this button whenever money moves in or out of the account outside of normal trades.',
  'account-page.guide.empty.transactions.title':
    'Cash movements are tracked here',
  'account-page.guide.empty.transactions.description':
    'This section keeps a row-by-row record of manual deposits and withdrawals, shown as Payouts on a prop-challenge account. When it is empty, use Add Event to create the first one.',
  'account-page.guide.empty.trade-log.title': 'Linked trades will appear here',
  'account-page.guide.empty.trade-log.description':
    'Trades show up here when they are assigned to this account. Once you have linked trades, this page becomes your full account breakdown.',
  'account-page.guide.main.intro.title': 'This page is your account breakdown',
  'account-page.guide.main.intro.description':
    'Use the Account Page to understand one account clearly: balance history, performance, risk limits, cash movements, and linked trades.',
  'account-page.guide.main.balance-chart.title':
    'The balance chart shows the account over time',
  'account-page.guide.main.balance-chart.description':
    'Use this chart to see how the account changed over time, not just where it stands today.',
  'account-page.guide.main.metrics.title': '仅此账户的表现',
  'account-page.guide.main.metrics.description':
    '仅限此账户的余额、盈亏、胜率和各项成本。Prop 账户会显示分润出金，而不是净现金流。',
  'account-page.guide.main.risk.title':
    'Risk progress is tracked separately here',
  'account-page.guide.main.risk.description':
    '已使用多少回撤额度，以及距离盈利目标还有多远。',
  'account-page.guide.main.transactions.title':
    'Cash movements stay in their own section',
  'account-page.guide.main.transactions.description':
    '每笔入金和出金及其后的余额，与交易结果分开记录。Prop 账户会在这里列出分润出金记录。',
  'account-page.guide.main.actions.title': '交易、资金与设置',
  'account-page.guide.main.actions.description':
    '在 Trade Log 中打开此账户的交易，用 + 记录一笔入金或出金，或编辑账户及其规则。',

  
  'account-dashboard.title': '账户',
  'account-dashboard.copy-badge.base': '基础',
  'account-dashboard.copy-badge.copy': '跟单',
  'account-dashboard.copy-badge.copied-by': '复制账户',
  'account-dashboard.copy-badge.copies-tooltip-masked': '复制 {account}',
  'account-dashboard.copy-badge.copies-tooltip':
    '以 {multiplier}x 复制 {account}',
  'account-dashboard.error.init': '多次尝试后,账户页面服务仍未初始化',
  'account-dashboard.error.loading': '加载账户出错:{error}',
  'account-dashboard.error.retry':
    '账户页面服务未就绪,将在 {delay}ms 后重试(第 {attempt}/{max} 次尝试)',
  'account-dashboard.empty.title': '未找到账户',
  'account-dashboard.empty.message': '创建账户以开始跟踪您的交易表现',
  'account-dashboard.section.empty': '暂无{type}账户',
  'account-dashboard.section.empty-sub': '创建账户后将在此处显示',
  'account-dashboard.button.create-first': '创建您的第一个账户',
  'account-dashboard.action.create': '创建新账户',
  'account-dashboard.action.settings': '账户设置',
  'account-dashboard.weight-bar.aria': '账户类型资产管理规模分布',
  'account-dashboard.weight-bar.segment-aria':
    '{name}：占总资产管理规模的 {percent}%',
  'account-dashboard.guide.empty.intro.title':
    'This page keeps all of your accounts in one place',
  'account-dashboard.guide.empty.intro.description':
    '使用“账户”集中查看所有账户。添加账户后，可在此快速比较。',
  'account-dashboard.guide.empty.state.title':
    'There is nothing here yet because no accounts exist',
  'account-dashboard.guide.empty.state.description':
    'The dashboard stays empty until you create your first account. After that, it will show account totals, sections, and shortcuts into each account page.',
  'account-dashboard.guide.empty.create.title':
    'Create your first account here',
  'account-dashboard.guide.empty.create.description':
    'Click this button to create the first account you want Journalit to track.',
  'account-dashboard.guide.empty.after-create.title':
    'After you save, Journalit opens the account page',
  'account-dashboard.guide.empty.after-create.description':
    'Fill in the basic account details and save. The next guide will pick up on the Account Page for that specific account.',
  'account-dashboard.guide.main.intro.title': '这些是您的账户',
  'account-dashboard.guide.main.intro.description':
    'Use this page to compare accounts, watch totals across all accounts, and jump into a single account when you need more detail.',
  'account-dashboard.guide.main.aum-chart.title':
    'AUM means assets under management',
  'account-dashboard.guide.main.aum-chart.description':
    'This chart tracks your combined account value over time, including deposits, withdrawals, and when accounts were added.',
  'account-dashboard.guide.main.metrics.title':
    'These metrics summarise all visible accounts',
  'account-dashboard.guide.main.metrics.description':
    'Use these stats for a quick account-level snapshot before drilling into specific account types or specific accounts.',
  'account-dashboard.guide.main.mode-switch.title':
    '概览和挑战是同一批账户的两种视图',
  'account-dashboard.guide.main.mode-switch.description':
    '概览保留 AUM 图表和投资组合总计。切换到挑战可查看自营挑战的经济数据：通过率、成本、出金以及所有挑战账户的阶段瓶颈。',
  'account-dashboard.guide.main.create-account.title':
    'You can create another account from here at any time',
  'account-dashboard.guide.main.create-account.description':
    'Use this button whenever you want to add a new account to the dashboard.',
  'account-dashboard.guide.main.settings-types.title':
    'Settings can manage available account types',
  'account-dashboard.guide.main.settings-types.description':
    'Inside settings, you can add custom account types and remove old ones if your workflow changes.',
  'account-dashboard.guide.main.settings-stages.title':
    '挑战阶段可设置账户类型',
  'account-dashboard.guide.main.settings-stages.description':
    '选择挑战达到评估、模拟 funded 或真实 funded 时应用的账户类型。将某个阶段设为“不更改”即可保持当前账户类型。',
  'account-dashboard.guide.main.settings-inclusion.title':
    'Settings can change what counts in totals',
  'account-dashboard.guide.main.settings-inclusion.description':
    'You can hide account types from dashboard totals without deleting them, and you can separately decide whether their withdrawals still count.',
  'account-dashboard.guide.main.settings-order.title':
    'This section controls the order of account groups',
  'account-dashboard.guide.main.settings-order.description':
    'Use these controls to decide which account types appear first on the dashboard.',

  'account-dashboard.guide.main.open-account.title':
    'Open any account card to go deeper',
  'account-dashboard.guide.main.open-account.description':
    '账户按类型分组，便于比较同类账户。打开任意卡片查看完整明细，账户页指南会在那里继续。',
  'account-dashboard.guide.whats-new.prop-challenges.intro.title':
    '新功能：交易考核挑战',
  'account-dashboard.guide.whats-new.prop-challenges.intro.description':
    '账户现在可以跟踪交易考核挑战：它的阶段、机构规则和你的出金。',
  'account-dashboard.guide.whats-new.prop-challenges.enable.title':
    '开始新的挑战',
  'account-dashboard.guide.whats-new.prop-challenges.enable.description':
    '创建账户时，开启“交易考核挑战”并选择你的机构。其规则会自动填好。',
  'account-dashboard.guide.whats-new.prop-challenges.mode.title':
    '查看你的所有挑战',
  'account-dashboard.guide.whats-new.prop-challenges.mode.description':
    '切换到“挑战”，查看所有挑战的进度、通过率、成本和出金。',
  'account-dashboard.metrics.total-accounts': '账户总数',
  'account-dashboard.metrics.total-aum': '总资产管理规模',
  'account-dashboard.metrics.total-growth': '总增长',
  'account-dashboard.metrics.growth-percent': '增长百分比',
  'account-dashboard.metrics.total-withdrawals': '总出金',
  'account-dashboard.metrics.no-withdrawals': '暂无出金',
  'account-dashboard.metrics.total-trades': '交易总数',
  'account-dashboard.type-header.excluded': '已排除',
  'account-dashboard.type-header.from-stats': '统计数据',
  'account-dashboard.type-header.of-total-aum': '占总资产管理规模',
  'account-dashboard.type-header.aum': '资产管理规模',
  'account-dashboard.type-header.withdrawals': '出金',
  'account-dashboard.type-header.account': '账户',
  'account-dashboard.type-header.accounts': '账户',
  'account-dashboard.type-header.trade': '交易',
  'account-dashboard.type-header.trades': '交易',
  'account-dashboard.type-header.growth': '增长({percent})',
  'account-card.metric.trades': '交易',
  'account-card.metric.withdrawals': '出金',
  'account-card.metric.age': '账龄',
  'account-card.progress.profit-target': '盈利目标',
  'account-card.progress.drawdown-used': 'Drawdown Limit Used',
  'account-card.progress.not-set': '未设置',
  'account-card.footer.monthly': '月度:',
  'account-card.footer.total-costs': '总成本:',
  'account.metrics.total-account-costs': '预计总成本',
  'account.metrics.total-costs': '总成本',
  'account.metrics.one-time-costs': '一次性成本',
  'account.metrics.recurring-costs-to-date': '截至目前的定期成本',
  'account.metrics.monthly-cost': '每月成本',

  
  
  
  'missed-trade.reason-title': '为什么错过了这笔交易',

  
  
  

  'timeline.status.loss': '亏损',

  'timeline.aria.session-navigation': 'Same-day trade navigation',
  'timeline.aria.previous-trade': 'Previous trade: {trade}',
  'timeline.aria.next-trade': 'Next trade: {trade}',
  'timeline.aria.no-previous-trade': 'No previous trade in this trading day',
  'timeline.aria.no-next-trade': 'No next trade in this trading day',

  
  
  
  'trade.review.title': '交易复盘',

  

  'trade.details.entry': '开仓',
  'trade.details.exit': '平仓',

  'trade.details.duration': '持仓时间',

  'trade.details.thesis': '交易论点',

  'trade.details.entries-summary': '{count} entries',
  'trade.details.exits-summary': '{count} exits',
  'trade.details.take-profit-count': '{count} targets',

  
  'trade.metadata.account': '账户:',

  'trade.metadata.setups': '策略',
  'trade.metadata.mistakes': '失误',

  
  'trade.image.no-images': '此交易暂无图片',
  'trade.image.click-edit': '点击编辑添加图片',
  'trade.image.alt-prefix': '交易图片',
  'command.share-note-as-image': '将当前笔记分享为图片',
  'trade.share.copy-screenshot': '复制交易截图',
  'trade.share.copied': '交易截图已复制到剪贴板',
  'trade.share.failed': '无法复制交易截图',
  'trade.share.not-ready': '交易笔记仍在加载，请稍后再试。',
  'share.review.action': '分享复盘卡片',
  'share.review.modal-title': '分享复盘',
  'share.review.section.top': '笔记开头',
  'share.review.select-all': '全选',
  'share.review.clear': '清除',
  'share.review.legend.widget': '组件',
  'share.review.legend.heading': '标题及其文字',
  'share.review.legend.media': '媒体',
  'share.review.legend.text': '文字',
  'share.review.copy': '复制图片',
  'settings.general.hide-dollar-amounts-in-shares': '在分享图片中隐藏美元金额',
  'settings.general.hide-dollar-amounts-in-shares-desc':
    '开启 R 倍数时，交易截图和复盘卡片会省略以美元计的风险、费用、佣金和 MAE/MFE。',
  'share.review.hide-dollar-amounts': '隐藏美元金额',
  'share.review.hide-dollar-amounts-hint': '省略风险、费用和其他美元数值。',
  'share.review.hide-dollar-amounts-needs-r':
    '在设置中开启 R 倍数，即可在不显示美元金额的情况下分享。',
  'share.review.copied': '分享卡片已复制到剪贴板',
  'share.review.failed': '无法复制分享卡片',

  

  'trade.review.reviewed': '已复盘',
  'trade.review.reviewed-on': '复盘于 {date}',

  

  
  
  
  'chart.label.pnl': 'P&L',
  'chart.legend.entry': '入场',
  'chart.legend.exit': '出场',
  'chart.legend.trade': '交易',
  'chart.shared.empty': '暂无交易数据',
  'chart.shared.empty-sub': '请尝试选择其他时间段',
  'chart.tooltip.peak-equity': 'Peak realized P&L',
  'chart.tooltip.pnl': '盈亏',
  'chart.tooltip.episode-start': 'Episode Start',
  'chart.tooltip.underwater-days': 'Time Underwater',
  'chart.tooltip.underwater-trades': 'Trades Underwater',

  'chart.tooltip.drawdown-amount': 'Amount',
  'chart.tooltip.drawdown-percent': 'Drawdown % of {basis}',
  'chart.tooltip.percent-basis': 'Percent Basis',
  'chart.tooltip.trade-pnl': '交易盈亏',

  'chart.tooltip.accounts-list': '{accounts}',
  'chart.tooltip.more-accounts': '+{count} more',
  'chart.loading': '图表加载中...',

  
  
  
  'metric.avgHoldTime.description': '所有已平仓交易的平均持仓时间',
  'metric.avgHoldTime.name': '平均持仓时间',
  'metric.avgLoss.description': '亏损交易的平均亏损',
  'metric.avgLoss.name': '平均亏损',
  'metric.avgRR.description': '平均盈利除以平均亏损',
  'metric.avgRR.name': '平均风险回报比(盈亏)',
  'metric.avgRRRiskBased.description': '平均盈利 R 与亏损 R（需止损数据）',
  'metric.avgRRRiskBased.name': '平均风险回报比(基于R)',
  'metric.avgLossHoldTime.description': '亏损交易的平均持仓时间',
  'metric.avgLossHoldTime.name': '平均亏损持仓时间',
  'metric.avgWin.description': '盈利交易的平均盈利',
  'metric.avgWin.name': '平均盈利',
  'metric.avgWinHoldTime.description': '盈利交易的平均持仓时间',
  'metric.avgWinHoldTime.name': '平均盈利持仓时间',
  'metric.bestDay.description': '单日最高盈亏',
  'metric.bestDay.name': '最佳单日',

  'metric.avgWinnerHeat.name': '盈利平均回撤',
  'metric.avgWinnerHeat.description': '盈利交易的平均 MAE',
  'metric.winnerMaeP90.name': '盈利 MAE P90',
  'metric.winnerMaeP90.description': '盈利交易 MAE 的第 90 百分位',
  'metric.winnerMaeMedian.name': '盈利 MAE 中位数',
  'metric.winnerMaeMedian.description': '盈利交易的 MAE 中位数',
  'metric.avgLossHeat.name': '亏损平均回撤',
  'metric.avgLossHeat.description': '亏损交易的平均 MAE',
  'metric.winnerAvgMfe.name': '盈利平均 MFE',
  'metric.winnerAvgMfe.description': '盈利交易的平均 MFE',
  'metric.loserAvgMfe.name': '亏损平均 MFE',
  'metric.loserAvgMfe.description': '亏损交易的平均 MFE',
  'metric.winnerMfeP90.name': '盈利 MFE P90',
  'metric.winnerMfeP90.description': '盈利交易 MFE 的第 90 百分位',
  'metric.loserMfeP90.name': '亏损 MFE P90',
  'metric.loserMfeP90.description': '亏损交易 MFE 的第 90 百分位',
  'metric.timeInDrawdown.name': 'Time in Drawdown',
  'metric.timeInDrawdown.description': '低于 P&L 高点的时间占比',
  'metric.avgRecoveryTime.name': 'Avg Recovery Time',
  'metric.avgRecoveryTime.description': '从回撤中恢复的平均时间',
  'metric.longestDrawdown.name': 'Longest Drawdown',
  'metric.longestDrawdown.description': '单次回撤持续的最长时间',
  'metric.drawdownEpisodes.name': 'Drawdown Episodes',
  'metric.drawdownEpisodes.description': '独立回撤期的次数',
  'metric.category.performance': '绩效',
  'metric.category.volume': '交易量',
  'metric.expectancy.description': '每笔交易的预期盈亏',
  'metric.sharpeRatio.name': '夏普比率',
  'metric.sharpeRatio.description': '平均单笔 P&L 相对其波动率',
  'metric.expectancy.name': '期望值',
  'metric.largestLoss.description': '最大亏损交易',
  'metric.longestWinStreak.name': '最佳连胜',
  'metric.longestWinStreak.description': '按平仓日期计算的最长连续盈利',
  'metric.longestLossStreak.name': '最差连亏',
  'metric.longestLossStreak.description': '按平仓日期计算的最长连续亏损',
  'metric.largestLoss.name': '最大亏损',
  'metric.largestWin.description': '最大盈利交易',
  'metric.largestWin.name': '最大盈利',
  'metric.maxDrawdown.description': '距前期 P&L 高点的最大跌幅',
  'metric.maxDrawdown.name': 'Max Drawdown',
  'metric.netPnL.description': '所有交易的总盈亏',
  'metric.netPnL.name': '净盈亏',
  'metric.numLossTrades.description': '亏损交易笔数',
  'metric.numLossTrades.name': '亏损交易',
  'metric.numTrades.description': '已平仓交易总笔数',
  'metric.numTrades.name': '已平仓交易',
  'metric.numWinTrades.description': '盈利交易笔数',
  'metric.numWinTrades.name': '盈利交易',
  'metric.profitFactor.description': '毛利润与毛亏损的比率',
  'metric.profitFactor.name': '盈利因子',
  'metric.winRate.description': '盈利交易的百分比',
  'metric.winRate.name': '胜率',

  
  
  

  
  'home.aria.customize': '自定义',

  'home.aria.filter-trade-types': '筛选交易类型',
  'home.aria.open-settings': '打开 Journalit 设置',
  'home.aria.save-layout': '保存布局',
  'home.button.add-widget': '添加小组件',

  'home.grid.error.message': '错误：{error}',
  'home.grid.error.retry': '重试',
  'home.grid.error.title': '网格布局错误',
  'home.grid.widget.remove-aria': '移除小组件',
  'home.grid.widget.unknown-type': '未知小组件类型:{widgetId}',
  'home.period.lifetime': '全部时间',
  'home.period.month': '月度',
  'home.period.quarter': '季度',
  'home.period.year': '年度',

  
  'home.greeting.afternoon-checkin': '下午时间',
  'home.greeting.day-going-well': '希望你今天一切顺利',
  'home.greeting.evening-review': '晚间复盘',
  'home.greeting.fresh-start': '新的开始',
  'home.greeting.good-afternoon': '下午好',
  'home.greeting.good-evening': '晚上好',
  'home.greeting.good-morning': '早上好',
  'home.greeting.good-to-see-you': '很高兴见到你',
  'home.greeting.welcome': '欢迎使用 Journalit!',
  'home.greeting.hey': '嘿',
  'home.greeting.hey-there': '你好呀',
  'home.greeting.how-did-today-go': '今天怎么样?',
  'home.greeting.hows-it-going': '最近如何?',
  'home.greeting.late-night': '深夜复盘?',
  'home.greeting.midday-momentum': '午间动力',
  'home.greeting.midnight-oil': '在熬夜吗?',
  'home.greeting.morning-trader': '早安,交易者',
  'home.greeting.nightowl': '夜猫子你好',
  'home.greeting.ready-conquer': '准备好征服今天了吗?',
  'home.greeting.rise-and-shine': '早安,新的一天',
  'home.greeting.still-up': '还没睡?',
  'home.greeting.time-to-reflect': '复盘时间',
  'home.greeting.welcome-back': '欢迎回来',
  'home.greeting.name-placeholder': '你的名字',
  'home.greeting.edit-name-aria': '{name}。编辑显示名称',
  'home.greeting.winding-down': '准备休息了?',
  'home.subtitle.agenda-today': '今天有什么计划?',
  'home.subtitle.check-progress': '来看看你的进展',
  'home.subtitle.elevate-trading': '提升你的交易水平',
  'home.subtitle.first-time': '开始你的交易之旅吧',
  'home.subtitle.journey-continues': '你的交易之旅在继续',
  'home.subtitle.ready-elevate': '准备好提升交易水平了吗?',
  'home.subtitle.see-how-doing': '看看最近表现如何',
  'home.subtitle.trading-going': '交易进展如何?',

  
  'home.quick-links.account-dashboard': '账户',
  'home.quick-links.add-trade': '添加交易',
  'home.quick-links.quick-import': 'Quick Import',
  'home.quick-links.csv-import': 'Trade Import',
  'home.quick-links.hide': '隐藏快捷链接',
  'home.quick-links.layout-builder': '布局构建器',
  'home.quick-links.navigation-sidebar': '导航侧栏',
  'home.quick-links.session-mode': '交易时段模式',
  'home.quick-links.economic-calendar': '财经日历',
  'home.quick-links.monthly-review': '本月复盘',
  'home.quick-links.quarterly-review': '本季度复盘',
  'home.quick-links.yearly-review': '本年度复盘',
  'home.quick-links.todays-drc': '今日每日复盘',
  'home.quick-links.trade-log': '交易日志',
  'home.quick-links.trading-dashboard': '仪表盘',
  'home.quick-links.weekly-review': '本周复盘',
  'home.quick-links.move-above': '将快捷链接移到组件上方',
  'home.quick-links.move-below': '将快捷链接移到组件下方',

  
  'home.widget-selector.add-shortcut': '添加账户/交易设置快捷方式',
  'home.widget-selector.restore': '恢复',
  'home.widget-selector.section.quick-links': '快捷链接',
  'home.widget-selector.title': '添加到首页',
  'home.widget-selector.subtitle': '通过预览浏览小组件，点击即可添加到首页。',
  'home.widget-selector.sample-note.title': '交易计划',
  'home.widget-selector.sample-note.intro':
    '只在关键价位交易 A+ 形态。每天最多 3 笔交易。',
  'home.widget-selector.sample-note.checklist': '盘前检查清单',
  'home.widget-selector.sample-note.task.calendar': '查看经济日历',
  'home.widget-selector.sample-note.task.levels': '在图表上标出关键价位',
  'home.widget-selector.sample-note.task.max-loss': '设置每日最大亏损',
  'home.widget-selector.sample-note.task.journal': '记录第一笔交易',
  'home.widget-selector.tab.performance': '表现',
  'home.widget-selector.tab.accounts': '账户',
  'home.widget-selector.tab.workflow': '工作流',

  
  'home.widget.aum.name': '资产管理规模',
  'home.widget.aum.description': '账户总余额及 7 日趋势',
  'home.widget.best-hours.name': '最佳交易时段',
  'home.widget.best-hours.description': '您盈利最多的交易时段',
  'home.widget.current-streak.name': '当前连胜/连败',
  'home.widget.current-streak.description': '追踪交易和复盘连胜',
  'home.widget.drawdown-monitor.name': '回撤监控',
  'home.widget.drawdown-monitor.description': '各账户回撤限额的使用情况',
  'home.widget.embedded-note.name': '嵌入笔记',
  'home.widget.embedded-note.description': '显示知识库中的任意笔记',
  'home.widget.goals-progress.name': '目标进度',
  'home.widget.goals-progress.description': '追踪交易目标的完成进度',
  'home.widget.position-size.name': '仓位大小计算器',
  'home.widget.position-size.description': '按账户风险百分比计算仓位',
  'home.widget.recent-items.name': '最近访问',
  'home.widget.recent-items.description': '快速访问最近打开的项目',
  'home.widget.setup-leaderboard.name': '最佳分组',
  'home.widget.setup-leaderboard.description':
    '对比最佳策略、标签、资产类型和代码',
  'home.widget.trading-score.name': '交易评分',
  'home.widget.trading-score.description': '衡量整体交易表现的综合评分',
  'home.widget.unreviewed-trades.name': '待复盘交易',
  'home.widget.unreviewed-trades.description': '需要复盘的交易记录',
  'home.widget.weekly-summary.name': '周度总结',
  'home.widget.weekly-summary.description': '本周交易活动汇总',
  'home.widget.key-events.name': '关键事件',
  'home.widget.key-events.description': '本周复盘中的新闻和市场事件',
  'home.widget.key-events.empty-title': '暂无关键事件',
  'home.widget.key-events.open-aria': '打开本周周度复盘',
  'home.widget.year-heatmap.name': '交易热力图',
  'home.widget.year-heatmap.description': '可视化展示您的交易活动',
  'home.widget.profit-target-widget.name': '盈利目标',
  'home.widget.profit-target-widget.description': '跟踪各账户的盈利目标进度',
  'home.widget.eval-roi.name': '考核 ROI',
  'home.widget.challenge-alerts.name': '挑战提醒',
  'home.widget.challenge-alerts.description':
    '已失败、已通过或可出金的自营账户',
  'home.widget.eval-roi.description': '自营挑战费用与已获出金对比',

  
  'home.widget.getting-started.name': 'Getting Started',
  'home.widget.getting-started.description': '帮你设置 Journalit 和交易的清单',
  'home.widget.getting-started.progress': '{completed}/{total} completed',
  'home.widget.getting-started.progress.loading': 'Checking progress...',
  'home.widget.getting-started.item.account.title': '设置你的交易账户',
  'home.widget.getting-started.item.account.description':
    '交易会记录到用于跟踪余额的账户中。没有账户就无法计算收益和回撤。',
  'home.widget.getting-started.item.account.time': '15s',
  'home.widget.getting-started.item.account.cta': '设置账户',
  'home.widget.getting-started.item.create.title': '导入你的交易历史',
  'home.widget.getting-started.item.create.description':
    '导入现有交易、连接 Trade Sync，或手动添加第一笔交易。',
  'home.widget.getting-started.item.create.time': '30s',
  'home.widget.getting-started.item.create.cta': '打开 Trade Import',
  'home.widget.getting-started.item.tradelog.title': 'Open Trade Log',
  'home.widget.getting-started.item.tradelog.description':
    'Your trade database for analysing all your trades in one place.',
  'home.widget.getting-started.item.tradelog.time': '10s',
  'home.widget.getting-started.item.tradelog.cta': 'Open Trade Log',
  'home.widget.getting-started.item.layouts.title': 'Open Layout Builder',
  'home.widget.getting-started.item.layouts.description':
    'Design your review templates your way.',
  'home.widget.getting-started.item.layouts.time': '1 min',
  'home.widget.getting-started.item.layouts.cta': 'Open Layout Builder',
  'home.widget.getting-started.item.sidebar.title': '打开导航侧栏',
  'home.widget.getting-started.item.sidebar.description':
    '快速访问 Journalit 页面、复盘、工具和搜索。',
  'home.widget.getting-started.item.sidebar.time': '10 秒',
  'home.widget.getting-started.item.sidebar.cta': '打开侧栏',
  'home.widget.getting-started.item.pro.title': 'Activate PRO',
  'home.widget.getting-started.item.pro.description':
    '启用 Trade Import、Trade Sync 和经济日历。',
  'home.widget.getting-started.item.pro.time': '1 min',
  'home.widget.getting-started.item.pro.cta': 'Activate',

  
  'home.widget.embedded-note.change-note': '更换笔记',
  'home.widget.embedded-note.error.deleted': '源文件已被删除',
  'home.widget.embedded-note.error.load-failed': '加载笔记内容失败',
  'home.widget.embedded-note.error.not-found': '未找到文件:{path}',
  'home.widget.embedded-note.no-notes': '未找到笔记',
  'home.widget.embedded-note.open-note': '点击打开笔记',
  'home.widget.embedded-note.search-placeholder': '搜索笔记...',

  'home.widget.embedded-note.select-note': '选择笔记',
  'home.widget.embedded-note.title': '嵌入笔记',

  
  'home.widget.goals-progress.aria.change-goal': '点击更改目标',
  'home.widget.goals-progress.aria.save-goal': '保存目标',
  'home.widget.goals-progress.aria.set-goal': '设置目标',
  'home.widget.goals-progress.click-to-set': '点击设置目标',
  'home.widget.goals-progress.complete-100': '已完成100%',
  'home.widget.goals-progress.complete-percent': '已完成{percent}%',
  'home.widget.goals-progress.goal-reached': '目标已达成',
  'home.widget.goals-progress.header.pnl': '盈亏目标',
  'home.widget.goals-progress.header.trades': '交易目标',
  'home.widget.goals-progress.header.win-rate': '胜率目标',
  'home.widget.goals-progress.of-target': '{period}目标{target}',
  'home.widget.goals-progress.period-label.this-month': '本月',
  'home.widget.goals-progress.period-label.this-week': '本周',
  'home.widget.goals-progress.period-label.today': '今日',
  'home.widget.goals-progress.period-label.total': '总计',
  'home.widget.goals-progress.period.daily': '每日',
  'home.widget.goals-progress.period.monthly': '每月',
  'home.widget.goals-progress.period.weekly': '每周',
  'home.widget.goals-progress.set-goal': '设置目标',
  'home.widget.goals-progress.target': '目标',
  'home.widget.goals-progress.tracks-lifetime': '追踪总计',
  'home.widget.goals-progress.trades-count': '{count}笔交易',
  'home.widget.goals-progress.type.pnl': '盈亏目标',
  'home.widget.goals-progress.type.pnl-desc': '周期内的盈亏目标',
  'home.widget.goals-progress.type.trades-logged': '交易数量',
  'home.widget.goals-progress.type.trades-logged-desc': '总交易次数',
  'home.widget.goals-progress.type.win-rate': '胜率',
  'home.widget.goals-progress.type.win-rate-desc': '获胜百分比目标',
  'home.widget.goals-progress.use-r-multiples': '使用R倍数',
  'home.widget.goals-progress.account-aware': '按账户设置目标',
  'home.widget.goals-progress.no-target-selected': '所选账户没有目标',
  'home.widget.goals-progress.configured-for': '已为 {accounts} 配置',
  'home.widget.goals-progress.account-scope': 'Account scope',
  'home.widget.goals-progress.add-account': 'Add account',

  
  'home.widget.best-hours.no-data': '暂无交易数据',
  'home.widget.best-hours.period-aria':
    '{label}: 每笔平均盈亏 {pnl}, {count} 笔交易',
  'home.widget.best-hours.title': '最佳交易时段',
  'home.widget.best-hours.trades-count': '{count} 笔交易',
  'home.widget.best-hours.win-rate': '{rate}% 胜率',
  'home.widget.best-hours.win-rate-na': '胜率不可用',
  'home.widget.best-hours.days-count': '{count} 天',
  'home.widget.best-hours.avg-per-trade': '每笔平均',

  'home.widget.best-hours.hidden': '已隐藏',
  'home.widget.best-hours.hidden-detail': '隐私模式',
  'home.widget.best-hours.no-positive-window': '暂无正收益时段',
  'home.widget.best-hours.insufficient-history': '需要更多数据',
  'home.widget.best-hours.sample-requirement': '{count}/2 个已采样时段',
  'home.widget.best-hours.developing': '形成中',
  'home.widget.best-hours.no-positive-detail': '已采样时段均为负收益',

  'home.widget.aum.account-count': '{count} 个账户',
  'home.widget.aum.account-count-plural': '{count} 个账户',
  'home.widget.aum.no-accounts': '暂无账户',
  'home.widget.aum.period.all': '全部时间',
  'home.widget.aum.period.month': '本月',
  'home.widget.aum.period.quarter': '本季度',
  'home.widget.aum.period.year': '本年',
  'home.widget.aum.title': '资产管理规模',
  'home.widget.aum.unable-to-load': '无法加载',

  
  'home.widget.drawdown.breached': '已突破',
  'home.widget.drawdown.no-accounts': '暂无设置限额的账户',

  'home.widget.profit-target.title': '盈利目标',
  'home.widget.profit-target.achieved': '已达成',
  'home.widget.profit-target.remaining': '剩余',
  'home.widget.profit-target.unable-to-load': '无法加载',
  'home.widget.profit-target.no-accounts': '暂无设置目标的账户',
  'home.widget.account-progress.configure-aria': '为{widget}选择账户',
  'home.widget.account-progress.config-title': '显示的账户',
  'home.widget.account-progress.mode.automatic': '自动',
  'home.widget.account-progress.mode.selected': '选择账户',
  'home.widget.account-progress.automatic-drawdown': '回撤最高的优先。',
  'home.widget.account-progress.automatic-profit-target': '最接近目标的优先。',
  'home.widget.account-progress.max-label': '最多显示',
  'home.widget.account-progress.max-all': '全部',
  'home.widget.account-progress.select-hint': '想选多少都可以。',
  'home.widget.account-progress.no-eligible': '暂无可选账户。',
  'home.widget.account-progress.none-selected': '未选择账户。点击选择。',
  'home.widget.account-progress.search': '搜索账户',
  'home.widget.account-progress.select-all': '全选',
  'home.widget.account-progress.select-none': '全不选',
  'home.widget.account-progress.select-all-aria': '选择所有列出的账户',
  'home.widget.account-progress.select-none-aria': '清除列出的账户',
  'home.widget.account-progress.no-match': '没有匹配的账户。',
  'home.widget.account-progress.none-available':
    '所选账户都无法显示。点击选择其他账户。',
  'home.widget.eval-roi.title': '考核 ROI',
  'home.widget.eval-roi.unable-to-load': '无法加载',
  'home.widget.eval-roi.no-challenges': '暂无 Prop 挑战',
  'home.widget.eval-roi.challenge-count': '{count} 个考核',
  'home.widget.eval-roi.challenge-count-plural': '{count} 个考核',
  'home.widget.eval-roi.net': '净额',
  'home.widget.eval-roi.spent': '已花费',
  'home.widget.eval-roi.payouts': '出金',
  'home.widget.eval-roi.break-even': '盈亏平衡',
  'home.widget.challenge-alerts.title': '挑战提醒',
  'home.widget.challenge-alerts.unable-to-load': '无法检查挑战提醒',
  'home.widget.challenge-alerts.empty': '暂无挑战提醒',
  'home.widget.challenge-alerts.count': '{count} 条提醒',
  'home.widget.challenge-alerts.count-plural': '{count} 条提醒',
  'home.widget.challenge-alerts.more': '还有 {count} 条',
  'home.widget.challenge-alerts.kind.failed': '未通过',
  'home.widget.challenge-alerts.kind.target': '已达目标',
  'home.widget.challenge-alerts.kind.passed': '已通过',
  'home.widget.challenge-alerts.kind.payout': '可出金',
  'home.widget.challenge-alerts.kind.lost': '出金资格失效',
  'home.widget.challenge-alerts.kind.unknown-account': '新账户 {label}',
  'home.widget.eval-roi.roi-aria': '考核费用回报率',
  'home.widget.drawdown.remaining': '剩余',
  'home.widget.drawdown.title': 'Drawdown Limit',
  'home.widget.drawdown.unable-to-load': '无法加载',

  
  'home.widget.streak.above-average': '高于{period}平均水平',
  'home.widget.streak.avg': '平均',
  'home.widget.streak.best': '最佳',
  'home.widget.streak.best-streak': '{period}最佳连胜纪录',
  'home.widget.streak.good-start': '良好开端',
  'home.widget.streak.in-a-row': '连续',
  'home.widget.streak.keep-going': '继续保持',
  'home.widget.streak.loss': '亏损',
  'home.widget.streak.losses': '亏损',
  'home.widget.streak.losses-process': '亏损是交易过程的一部分',
  'home.widget.streak.no-active': '无活跃连胜/连败',
  'home.widget.streak.pause': '下次交易前请暂停思考',
  'home.widget.streak.period.ever': '历史',
  'home.widget.streak.period.month': '本月',
  'home.widget.streak.period.quarter': '本季度',
  'home.widget.streak.period.year': '今年',
  'home.widget.streak.review': '下次交易前请复盘',
  'home.widget.streak.start-trading': '开始交易以建立连胜纪录',
  'home.widget.streak.stay-focused': '保持专注,继续前进',
  'home.widget.streak.title': '连胜纪录',
  'home.widget.streak.win': '盈利',
  'home.widget.streak.wins': '盈利',

  
  'home.widget.heatmap.close-selector': '关闭年份选择器',
  'home.widget.heatmap.last-3-months': '最近3个月',
  'home.widget.heatmap.last-6-months': '最近6个月',
  'home.widget.heatmap.select-year': '选择年份',
  'home.widget.heatmap.year-activity': '{year}年活动',

  
  'home.widget.recent.days-ago': '{days}天前',
  'home.widget.recent.hint': '打开文件或视图后会显示在这里',
  'home.widget.recent.hours-ago': '{hours}小时前',
  'home.widget.recent.just-now': '刚刚',
  'home.widget.recent.minutes-ago': '{minutes}分钟前',
  'home.widget.recent.no-items': '暂无最近项目',
  'home.widget.recent.title': '最近',
  'home.widget.recent.unknown': '未知',

  
  'home.widget.top-breakdown.title': '热门{dimension}',
  'home.widget.top-breakdown.configure-title': '自定义热门{dimension}',
  'home.widget.top-breakdown.aria.customize': '点击自定义热门{dimension}',

  'home.widget.setups.title': '热门交易设置',
  'home.widget.setups.trades-count': '{count}笔交易',
  'home.widget.setups.win-rate': '{rate}%胜率',

  
  'home.widget.unreviewed.all-reviewed': '所有交易已复盘',
  'home.widget.unreviewed.need-review.few': '{count}笔交易待复盘',
  'home.widget.unreviewed.need-review.many': '{count}笔交易待复盘',
  'home.widget.unreviewed.need-review.one': '{count}笔交易待复盘',
  'home.widget.unreviewed.need-review.other': '{count}笔交易待复盘',
  'home.widget.unreviewed.this-week': '本周{count}笔',
  'home.widget.unreviewed.title-review': '打开交易日志进行复盘',
  'home.widget.unreviewed.today': '今日{count}笔',

  
  'home.widget.weekly.above-average': '高于周均水平',
  'home.widget.weekly.below-average': '低于周均水平',
  'home.widget.weekly.breakeven': '本周目前持平',
  'home.widget.weekly.better-than-last': '优于上周',
  'home.widget.weekly.early-in-week': '本周刚开始',
  'home.widget.weekly.losing-days': '连续{count}天亏损',
  'home.widget.weekly.no-trade-data': '暂无交易数据',
  'home.widget.weekly.no-trades': '本周暂无交易',
  'home.widget.weekly.no-trades-tooltip': '暂无交易',
  'home.widget.weekly.on-track': '本周进展顺利',
  'home.widget.weekly.room-to-recover': '仍有回本空间',
  'home.widget.weekly.slower-than-last': '慢于上周',
  'home.widget.weekly.solid-start': '本周开局良好',
  'home.widget.weekly.title': '本周',
  'home.widget.weekly.trade': '笔交易',
  'home.widget.weekly.trades': '笔交易',
  'home.widget.weekly.winning-days': '连续{count}天盈利',

  
  
  

  
  'widget.goals.title.daily': '每日目标',
  'widget.goals.title.weekly': '每周目标',
  'widget.goals.title.monthly': '每月目标',
  'widget.goals.title.quarterly': '季度目标',
  'widget.goals.title.yearly': '年度目标',
  'widget.goals.title.default': '目标',
  'widget.goals.tooltip.daily':
    '此处添加的条目仅适用于当天。如需在所有新建每日复盘中添加循环条目,请前往设置 > 复盘。',
  'widget.goals.tooltip.weekly':
    '此处添加的条目仅适用于本周。如需在所有新建周度复盘中添加循环条目,请前往设置 > 复盘。',
  'widget.goals.tooltip.monthly':
    '此处添加的条目仅适用于本月。如需在所有新建月度复盘中添加循环条目,请前往设置 > 复盘。',
  'widget.goals.tooltip.quarterly':
    '此处添加的条目仅适用于本季度。如需在所有新建季度复盘中添加循环条目,请前往设置 > 复盘。',
  'widget.goals.tooltip.yearly':
    '此处添加的条目仅适用于本年度。如需在所有新建年度复盘中添加循环条目,请前往设置 > 复盘。',
  'widget.goals.completed': '已完成 {completed}/{total}',
  'widget.goals.placeholder': '添加新目标...',
  'widget.goals.empty.preview': '暂无目标配置',
  'widget.goals.empty.default': '暂无目标,请在下方添加。',
  'widget.goals.invalid-context':
    '目标组件需要复盘笔记(每日复盘、周度、月度、季度或年度复盘)',
  'widget.goals.aria.edit': '编辑目标',
  'widget.goals.aria.delete': '删除目标',
  'widget.goals.name': '目标',
  'widget.goals.description': '带完成复选框的每日目标',

  
  'widget.header.name': '页头',

  'widget.header.invalid-context':
    "frontmatter格式无效:需要'type'字段(drc/weekly-review/monthly-review/quarterly-review/trade)和日期字段(复盘使用'date',交易使用'entryTime')",
  'widget.header.aria.mark-reviewed': '点击标记为已复盘',
  'widget.header.aria.mark-not-reviewed': '点击标记为未复盘',
  'widget.header.unknown-instrument': '未知品种',
  'widget.header.week': '第{number}周',
  'widget.header.quarter': '第{number}季度',
  'widget.header.drc': '每日复盘',
  'widget.header.nav.prev': '← 上一个',
  'widget.header.nav.next': '下一个 →',
  'widget.header.day.0': '周日',
  'widget.header.day.1': '周一',
  'widget.header.day.2': '周二',
  'widget.header.day.3': '周三',
  'widget.header.day.4': '周四',
  'widget.header.day.5': '周五',
  'widget.header.day.6': '周六',
  'widget.header.month.0': '一月',
  'widget.header.month.1': '二月',
  'widget.header.month.2': '三月',
  'widget.header.month.3': '四月',
  'widget.header.month.4': '五月',
  'widget.header.month.5': '六月',
  'widget.header.month.6': '七月',
  'widget.header.month.7': '八月',
  'widget.header.month.8': '九月',
  'widget.header.month.9': '十月',
  'widget.header.month.10': '十一月',
  'widget.header.month.11': '十二月',
  'widget.header.month-short.0': '1月',
  'widget.header.month-short.1': '2月',
  'widget.header.month-short.2': '3月',
  'widget.header.month-short.3': '4月',
  'widget.header.month-short.4': '5月',
  'widget.header.month-short.5': '6月',
  'widget.header.month-short.6': '7月',
  'widget.header.month-short.7': '8月',
  'widget.header.month-short.8': '9月',
  'widget.header.month-short.9': '10月',
  'widget.header.month-short.10': '11月',
  'widget.header.month-short.11': '12月',

  
  'widget.picker.placeholder': '选择组件...',
  'widget.picker.search-placeholder': '搜索组件...',
  'widget.picker.search-label': '搜索组件',
  'widget.picker.clear-search': '清除组件搜索',
  'widget.picker.results-label': '可用组件',
  'widget.picker.no-results': '没有符合搜索条件的组件',

  
  'widget.category.charts': '图表',
  'widget.category.statistics': '统计',
  'widget.category.content': '内容',
  'widget.category.tables': '表格',
  'widget.category.layout': '布局',

  
  'widget.review.name': '复盘',
  'widget.review.description': '心态与技术表现评分',
  'widget.review-context-fields.name': 'Review Context Fields',
  'widget.review-context-fields.description':
    'Editable custom context fields for review notes',
  'widget.review-context-fields.group.default': 'Review Context',

  'widget.review-context-fields.empty-title':
    'No review context fields configured for this review type.',
  'widget.review-context-fields.empty-desc':
    'Create review custom fields in settings to capture bias, focus, intent, and other planning context.',
  'widget.review-context-fields.configure': 'Configure Review Fields',
  'widget.review-context-fields.service-unavailable':
    'Review custom fields are not available yet.',
  'widget.review-context-fields.unsupported-type':
    'Unsupported review field type.',
  'widget.review-context-fields.source-missing':
    'This parent review does not exist yet.',
  'widget.review-context-fields.source-invalid':
    'This parent review exists but is not a valid review note.',
  'widget.review-context-fields.source-empty': '此上级复盘尚未填写可继承的值。',

  'widget.review.title': '表现复盘',
  'widget.review.mental-game': '心态',
  'widget.review.technical-game': '技术',
  'widget.review.star-hint': '单击评整星,右键评半星',
  'widget.review.invalid-context':
    "复盘组件需要在 DRC 或周复盘笔记中使用(frontmatter type: 'drc' 或 'weekly-review')",

  
  'widget.checklist.name': '检查清单',
  'widget.checklist.description': '盘前准备检查清单',

  
  'widget.session-mistakes.name': '会话错误',
  'widget.session-mistakes.description': '记录当日收盘后的行为错误',

  
  'widget.key-levels.name': '关键价位',
  'widget.key-levels.description': '需关注的重要价格位置',

  
  'widget.key-events.name': '重要事件',
  'widget.key-events.description': '该时段内的重要事件',
  'widget.key-events.title': '重要事件',
  'widget.key-events.tooltip':
    '关键事件会保存到你的周复盘中，也可以在此 DRC 中添加或编辑。',
  'widget.key-events.placeholder': '选择或创建事件',
  'widget.key-events.color-label': '颜色:',
  'widget.key-events.color-aria': '选择{color}颜色',
  'widget.key-events.day-label': '日期:',
  'widget.key-events.currency-label': '货币：',
  'widget.key-events.time-label': '时间：',
  'widget.key-events.field-unset': '未设置',
  'widget.key-events.notes-placeholder': '事件备注(可选)',
  'widget.key-events.notes-label': '备注',
  'widget.key-events.default-notes-tooltip':
    '默认备注可在设置 → 自定义 → 事件中管理。在此处选择事件时，会自动填充其保存的默认备注。',
  'widget.key-events.add-button': '添加事件',
  'widget.key-events.empty-state': '今日无重要事件',
  'widget.key-events.empty-state-sub': '在周复盘中添加事件',
  'widget.key-events.open-calendar-aria': '打开财经日历',
  'widget.key-events.restore-auto-import': '恢复自动导入的事件',
  'widget.key-events.restore-missing-events': '恢复缺少的事件（{count}）',

  
  'widget.missed-trades.name': '错过的交易',
  'widget.missed-trades.description': '识别到但未执行的交易机会',

  
  'widget.images.name': '图表和媒体',
  'widget.images.description': '支持上传的媒体轮播',
  'widget.images.invalid-context':
    "图片组件需要在复盘笔记中使用(type: 'drc'、'weekly-review'、'monthly-review'、'quarterly-review' 或 'yearly-review')",
  'widget.images.alt-prefix': '复盘媒体',
  'widget.images.stacked-alt': '复盘媒体 {index}',
  'widget.images.open-fullscreen': '全屏查看媒体 {index}',
  'widget.images.delete': '删除媒体',
  'widget.images.empty': '暂无媒体',
  'widget.images.placeholder': '粘贴图片 URL 或文件路径...',
  'widget.images.placeholder-add-more': '添加更多媒体...',

  
  'widget.mark-reviewed.name': '标记已复盘',
  'widget.mark-reviewed.description': '标记复盘完成并记录时间的横幅',
  'widget.mark-reviewed.status.reviewed': '已复盘',
  'widget.mark-reviewed.status.pending': '待复盘',
  'widget.mark-reviewed.button.undo': '撤销',
  'widget.mark-reviewed.button.mark': '标记已复盘',

  
  'widget.pnl-chart.name': '净值曲线',
  'widget.pnl-chart.description': '累计盈亏随时间变化',
  'widget.drawdown-chart.name': 'Drawdown',
  'widget.drawdown-chart.description':
    'Closed-trade drawdown amount from the prior realized P&L high',
  'widget.directional-pnl.name': 'Directional P&L',
  'widget.directional-pnl.description': 'Long vs short performance comparison',
  'widget.trades-chart.name': '交易盈亏',
  'widget.trades-chart.description': '每笔交易的盈亏柱状图',
  'widget.trades-chart-daily.name': '日盈亏',
  'widget.trades-chart-daily.description': '按日汇总的盈亏',
  'widget.trades-chart-weekly.name': '周盈亏',
  'widget.trades-chart-weekly.description': '按周汇总的盈亏',
  'widget.trades-chart-monthly.name': '月盈亏',
  'widget.trades-chart-monthly.description': '按月汇总的盈亏',
  'widget.trades-chart-quarterly.name': '季度盈亏',
  'widget.trades-chart-quarterly.description': '按季度汇总的盈亏',

  
  'widget.stats.name': '统计面板',
  'widget.stats.description': '关键绩效指标网格展示',
  'widget.stats.no-trades': '该时段无已平仓交易',
  'widget.stats.net-pnl': '净盈亏',
  'widget.stats.win-rate': '胜率',
  'widget.stats.profit-factor': '盈利因子',
  'widget.stats.expectancy': '期望值',
  'widget.stats.total-trades': '总交易数',
  'widget.stats.avg-win': '平均盈利',
  'widget.stats.avg-loss': '平均亏损',
  'widget.stats.pl-ratio': '盈亏比',
  'widget.account-breakdown.name': 'Account Breakdown',
  'widget.account-breakdown.description':
    'Compare performance across accounts in this review period',

  
  'widget.account-breakdown.empty': 'No closed trades for this period',
  'widget.account-breakdown.column.account': 'Account',
  'widget.account-breakdown.column.trades': 'Trades',
  'widget.account-breakdown.column.pnl': 'Net P&L',
  'widget.account-breakdown.column.win-rate': 'Win Rate',
  'widget.account-breakdown.column.profit-factor': 'Profit Factor',
  'widget.tag-performance.name': '标签表现',
  'widget.tag-performance.description': '按交易标签细分表现',
  'widget.setup-performance.name': '策略绩效',
  'widget.setup-performance.description': '按交易策略分类的绩效统计',

  
  'widget.best-worst-trades.name': '最佳/最差交易',
  'widget.best-worst-trades.description': '盈利最多和亏损最多的交易',
  'widget.best-worst.best-trade': '最佳交易',
  'widget.best-worst.worst-trade': '最差交易',
  'widget.best-worst.no-win-trades': '无盈利交易',
  'widget.best-worst.no-loss-trades': '无亏损交易',
  'widget.best-worst.best-month': '最佳月份',
  'widget.best-worst.worst-month': '最差月份',
  'widget.best-worst.no-profitable-months': '无盈利月份',
  'widget.best-worst.no-losing-months': '无亏损月份',
  'widget.best-worst.n-trades': '{count} 笔交易',
  'widget.best-worst.win-rate': '胜率 {rate}%',

  
  'widget.best-worst-days.name': '最佳/最差交易日',
  'widget.best-worst-days.description': '盈亏最高和最低的交易日',
  'widget.best-worst-days.best-day': '最佳交易日',
  'widget.best-worst-days.worst-day': '最差交易日',
  'widget.best-worst-days.no-profitable-days': '无盈利交易日',
  'widget.best-worst-days.no-losing-days': '无亏损交易日',
  'widget.best-worst-days.trade-count.one': '{count} 笔交易',
  'widget.best-worst-days.trade-count.few': '{count} 笔交易',
  'widget.best-worst-days.trade-count.many': '{count} 笔交易',
  'widget.best-worst-days.trade-count.other': '{count} 笔交易',
  'widget.best-worst-days.win-rate': '胜率 {rate}%',
  'widget.best-worst-days.invalid-context': '此组件仅在周度和月度复盘中可用',

  
  'widget.position-size.title': '仓位计算器',
  'widget.position-size.save-defaults': '保存为默认值',
  'widget.position-size.reset-defaults': '重置为默认值',
  'widget.position-size.stock-crypto': '股票/加密货币',
  'widget.position-size.futures': '期货',
  'widget.position-size.forex': '外汇',
  'widget.position-size.account-balance': '账户余额',
  'widget.position-size.risk-percent': '风险 %',
  'widget.position-size.entry-price': '入场价',
  'widget.position-size.profit-target-optional': '止盈目标(可选)',
  'widget.position-size.currency-pair': '货币对',
  'widget.position-size.stop-loss-pips': '止损(点)',
  'widget.position-size.target-pips-optional': '目标(点,可选)',
  'widget.position-size.placeholder.example': '例如:{value}',
  'widget.position-size.enter-values': '请输入数值',
  'widget.position-size.risk': '风险',
  'widget.position-size.reward': '收益',
  'widget.position-size.stop': '止损',
  'widget.position-size.pts': '点',
  'widget.position-size.mini': '迷你手',
  'widget.position-size.pip-value-info': '点值:${value}(标准手)| 点大小:{size}',
  'widget.position-size.futures-info':
    '${dollar}/点 | 最小变动:{size} = ${value}',
  'widget.position-size.investment-dollar': '投资金额($)',
  'widget.position-size.investment': '投资金额',
  'widget.position-size.at-price': '@ ${price}',

  
  'widget.best-worst-weeks.name': '最佳/最差周',
  'widget.best-worst-weeks.description': '盈亏最高和最低的周',
  'widget.best-worst-weeks.best-week': '最佳周',
  'widget.best-worst-weeks.worst-week': '最差周',
  'widget.best-worst-weeks.no-profitable': '无盈利周',
  'widget.best-worst-weeks.no-losing': '无亏损周',
  'widget.best-worst-weeks.week-name': '第 {number} 周({start} - {end})',
  'widget.best-worst-weeks.trade-count': '{count} 笔交易',
  'widget.best-worst-weeks.win-rate': '胜率 {percent}%',
  'widget.best-worst-weeks.invalid-context':
    '此组件仅在周度、月度、季度和年度复盘中可用',

  
  'widget.best-worst-months.name': '最佳/最差月',
  'widget.best-worst-months.description': '盈亏最高和最低的月份',
  'widget.best-worst-months.invalid-context': '此组件仅在季度和年度复盘中可用',

  
  'widget.best-worst-quarters.name': '最佳/最差季度',
  'widget.best-worst-quarters.description': '盈亏最高和最低的季度',
  'widget.best-worst-quarters.best-quarter': '最佳季度',
  'widget.best-worst-quarters.worst-quarter': '最差季度',
  'widget.best-worst-quarters.no-profitable': '无盈利季度',
  'widget.best-worst-quarters.no-losing': '无亏损季度',
  'widget.best-worst-quarters.trade-count': '{count} 笔交易',
  'widget.best-worst-quarters.win-rate': '胜率 {percent}%',
  'widget.best-worst-quarters.invalid-context': '此组件仅在年度复盘中可用',

  
  'widget.technical-game.name': '技术水平',
  'widget.technical-game.description': '每日复盘中的技术评分分布',
  'widget.mental-game.name': '心态管理',
  'widget.mental-game.description': '每日复盘中的心态评分分布',

  
  'widget.demon-tracker.name': '交易恶习追踪',
  'widget.demon-tracker.description': '追踪反复出现的交易错误',

  
  'widget.trading-score.title': '交易评分',
  'widget.trading-score.no-data': '暂无交易数据',
  'widget.trading-score.breakdown-title': '评分明细',
  'widget.trading-score.close-breakdown': '收起明细',
  'widget.trading-score.of-weeks': '共 {count} 周',
  'widget.trading-score.start-trading': '开始交易以解锁您的评分',
  'widget.trading-score.one-week-down': '已完成1周,继续加油!',
  'widget.trading-score.weeks-to-unlock.one': '还需 {count} 周解锁',
  'widget.trading-score.weeks-to-unlock.few': '还需 {count} 周解锁',
  'widget.trading-score.weeks-to-unlock.many': '还需 {count} 周解锁',
  'widget.trading-score.weeks-to-unlock.other': '还需 {count} 周解锁',
  'widget.trading-score.trades-to-unlock.one': '还需 {count} 笔交易解锁',
  'widget.trading-score.trades-to-unlock.few': '还需 {count} 笔交易解锁',
  'widget.trading-score.trades-to-unlock.many': '还需 {count} 笔交易解锁',
  'widget.trading-score.trades-to-unlock.other': '还需 {count} 笔交易解锁',
  'widget.trading-score.collect-more-data': '再积累一些数据即可解锁评分',
  'widget.trading-score.trades-logged.one': '已记录 {count} 笔交易',
  'widget.trading-score.trades-logged.few': '已记录 {count} 笔交易',
  'widget.trading-score.trades-logged.many': '已记录 {count} 笔交易',
  'widget.trading-score.trades-logged.other': '已记录 {count} 笔交易',
  'widget.trading-score.trades-count': '{count} 笔交易',
  'widget.trading-score.weight': '权重:{weight}%',
  'widget.trading-score.weeks-suffix': '· {weeks}周',
  'widget.trading-score.axis-aria': '{axis}:{score} 分,权重 {weight}%',

  
  'widget.trading-score.phase.insufficient': '数据不足',
  'widget.trading-score.phase.developing': '成长期',
  'widget.trading-score.phase.established': '成熟期',

  
  'widget.trading-score.axis.profitability': '盈利能力',
  'widget.trading-score.axis.riskManagement': '风险管理',
  'widget.trading-score.axis.execution': '执行力',
  'widget.trading-score.axis.consistency': '一致性',
  'widget.trading-score.axis.returnConsistency': '收益稳定性',
  'widget.trading-score.axis.experience': '经验',

  
  'widget.trading-score.axis.profitability.desc': '衡量盈利因子和单笔期望值',
  'widget.trading-score.axis.riskManagement.desc':
    '衡量最大回撤控制和回撤恢复能力',
  'widget.trading-score.axis.execution.desc': '衡量胜率和平均盈亏比',
  'widget.trading-score.axis.consistency.desc': '衡量收益稳定性和连续交易控制',
  'widget.trading-score.axis.returnConsistency.desc': '衡量止盈止损的一致性',
  'widget.trading-score.axis.experience.desc': '衡量活跃交易周数和交易持续性',

  
  'widget.trades.name': '交易列表',
  'widget.trades.description': '包含关键详情的交易列表',
  'widget.trade-review.name': '交易复盘',
  'widget.trade-review.description': '用图片、关键数据和可配置问题复盘每笔交易',
  'widget.trade-review.status.reviewed': '已复盘',
  'widget.trade-review.status.pending': '待复盘',
  'widget.trade-review.no-image': '没有交易图片',
  'widget.trade-review.open-trade-note': '打开交易笔记',

  'widget.trade-review.loading': '正在加载交易复盘...',
  'widget.trade-review.no-trades': '没有可复盘的交易。',
  'widget.trade-review.time.open': '未平仓',
  'widget.trade-review.fallback-title': '交易 {index}',
  'widget.trade-review.question.win-what-worked': '哪些地方做得好？',
  'widget.trade-review.placeholder.win-what-worked':
    '这笔交易中你执行得好的地方是什么？',
  'widget.trade-review.question.win-repeatable': '这可以重复吗？',
  'widget.trade-review.placeholder.win-repeatable':
    '是什么让这笔交易具有可重复性？',
  'widget.trade-review.question.key-lesson': '关键教训',
  'widget.trade-review.placeholder.key-lesson': '你应该从这笔交易中记住什么？',
  'widget.trade-review.question.loss-what-went-wrong': '哪里出了问题？',
  'widget.trade-review.placeholder.loss-what-went-wrong':
    '是什么造成了这次亏损？',
  'widget.trade-review.question.loss-valid-or-mistake':
    '这是合理亏损还是执行错误？',
  'widget.trade-review.placeholder.loss-valid-or-mistake':
    '说明这是流程内亏损还是可避免的问题。',
  'widget.trade-review.question.loss-avoid-next-time': '下次我要避免什么？',
  'widget.trade-review.placeholder.loss-avoid-next-time':
    '需要改变哪个具体行为？',
  'widget.trade-review.question.be-managed-correctly': '这笔交易管理得当吗？',
  'widget.trade-review.placeholder.be-managed-correctly':
    '管理是否符合你的计划？',
  'widget.trade-review.image-alt-prefix': '交易复盘图片',
  'widget.trade-review.placeholder.default': '写下你的想法...',

  'widget.trade-review.field.entry': '入场',
  'widget.trade-review.field.exit': '出场',
  'widget.trade-review.field.duration': '持续时间',
  'widget.trade-review.field.risk': '风险',
  'widget.trade-review.field.account': '账户',
  'widget.trade-review.field.setup': '设置',
  'widget.trade-review.field.mistakes': '错误',
  'widget.trade-review.field.tags': '标签',
  'widget.trade-review.more-context': '更多上下文',
  'widget.trade-review.field.position-size': '持仓大小',
  'widget.trade-review.field.stop-loss': '止损',
  'widget.trade-review.field.take-profit': '止盈',
  'widget.trade-review.field.fees': '费用',
  'widget.trade-review.field.commission': '佣金',
  'widget.trade-review.field.mae': 'MAE',
  'widget.trade-review.field.mfe': 'MFE',
  'widget.trade-review.field.thesis': '交易论点',
  'widget.trade-review.field.notes': '备注',
  'widget.trade-review.field.custom-fields': '自定义字段',
  'widget.backtest-trades.name': '回测交易',
  'widget.backtest-trades.description': '显示本次复盘周期内的回测交易列表',
  'widget.breakdown-daily.name': '每日汇总',
  'widget.breakdown-daily.description': '按日分组的绩效表',
  'widget.breakdown-weekly.name': '每周汇总',
  'widget.breakdown-weekly.description': '按周分组的绩效表',
  'widget.breakdown-monthly.name': '每月汇总',
  'widget.breakdown-monthly.description': '按月分组的绩效表',
  'widget.breakdown-quarterly.name': '每季汇总',
  'widget.breakdown-quarterly.description': '按季度分组的绩效表',
  'widget.breakdown.empty.days-week': '本周没有交易日',
  'widget.breakdown.empty.weeks-month': '本月没有交易周',
  'widget.breakdown.empty.months-quarter': '本季度没有交易月',
  'widget.breakdown.empty.quarters-year': '今年没有交易季度',

  
  'widget.table.header.date': '日期',
  'widget.table.header.week': '周',
  'widget.table.header.month': '月',
  'widget.table.header.quarter': '季度',

  'widget.table.header.trades': '交易数',
  'widget.table.header.pnl': '盈亏',
  'widget.table.header.win-rate': '胜率',
  'widget.table.header.profit-factor': '盈亏比',
  'widget.table.header.tag': '标签',
  'widget.table.header.setup': '交易设置',
  'widget.table.header.a-games': 'A级交易',
  'widget.table.header.b-games': 'B级交易',
  'widget.table.header.c-games': 'C级交易',
  'widget.table.header.rating': '评分',
  'widget.table.header.avg-rating': '平均评分',

  
  'widget.demon-tracker.column.demon': '交易心魔',
  'widget.demon-tracker.column.occurrences': '出现次数',
  'widget.demon-tracker.column.stop-trading': '停止交易',
  'widget.demon-tracker.period.this-week': '本周',
  'widget.demon-tracker.period.this-month': '本月',
  'widget.demon-tracker.period.this-quarter': '本季度',
  'widget.demon-tracker.period.this-year': '今年',
  'widget.demon-tracker.empty.title': '{period}未记录失误',
  'widget.demon-tracker.empty.description':
    '在交易中记录的失误将显示在此处,以帮助识别模式',
  'widget.demon-tracker.summary.unique': '独立失误总数:',
  'widget.demon-tracker.summary.total': '失误发生总次数:',
  'widget.demon-tracker.summary.critical': '严重失误({threshold}+):',

  
  'widget.markdown-zone.name': 'Markdown 区域',
  'widget.markdown-zone.description': '自由格式的 Markdown 内容区域',
  'widget.markdown-header.name': '章节标题',
  'widget.markdown-header.description': '自定义文本的 Markdown 标题(H1-H6)',

  
  'widget.checklist.title': '交易前检查清单',
  'widget.checklist.weekly-title': '每周预检查清单',
  'widget.checklist.tooltip.weekly': '此处添加的项目仅适用于本周。',
  'widget.checklist.tooltip.weekly-settings-link':
    '如需在所有新建周复盘中添加固定项目，请前往 设置 > 复盘。',
  'widget.checklist.tooltip.day-only':
    '此处添加的项目仅适用于当天。如需在所有新建日复盘中添加固定项目,请前往 设置 > 复盘。',
  'widget.checklist.tooltip.settings-link': '在插件设置中添加检查清单项目',
  'widget.checklist.completed': '已完成',
  'widget.checklist.edit-item': '编辑项目',
  'widget.checklist.delete-item': '删除项目',
  'widget.checklist.empty.preview': '未配置检查清单项目',
  'widget.checklist.empty.add-one': '暂无检查清单项目,请在下方添加。',
  'widget.checklist.placeholder': '添加新的检查清单项目...',
  'widget.checklist.invalid-context':
    '检查清单组件需要日复盘或周复盘笔记(frontmatter type: drc 或 weekly-review)',

  
  'widget.session-mistakes.title': '会话错误',
  'widget.session-mistakes.subtitle':
    '按交易会话记录一次错误,而不是在每笔交易里重复标记。',

  'widget.session-mistakes.placeholder': '选择或创建错误',
  'widget.session-mistakes.empty': '尚未记录会话错误',

  'widget.session-mistakes.invalid-context':
    '会话错误组件仅支持 DRC 笔记(frontmatter type: drc)',

  
  'widget.directional-pnl.title.long': '做多交易盈亏',
  'widget.directional-pnl.title.short': '做空交易盈亏',
  'widget.directional-pnl.empty.not-enough': '交易数量不足,无法进行方向性分析',
  'widget.directional-pnl.empty.no-closed': '该周期内无已平仓交易',
  'widget.directional-pnl.empty.no-long': '该周期内无做多交易',
  'widget.directional-pnl.empty.no-short': '该周期内无做空交易',

  
  'widget.missed-trades.title': '错过的交易',
  'widget.missed-trades.add-button': '添加',
  'widget.missed-trades.add-aria': '添加错过的交易',

  'widget.missed-trades.additional-setups': '其他策略:',
  'widget.missed-trades.no-trades-today': '今日无',
  'widget.missed-trades.no-trades-week': '本周没有错过的交易',
  'widget.missed-trades.invalid-context': '错过的交易组件需要复盘笔记',
  'widget.missed-trades.error-no-date': '无法添加错过的交易:笔记没有日期',
  'widget.missed-trades.error-open-form': '无法打开错过的交易表单',
  'widget.backtest-trades.empty': '该周期内没有回测交易',

  
  'widget.trade-table.column.images': '图片',
  'widget.trade-table.column.date': '日期',
  'widget.trade-table.column.entry': '入场',
  'widget.trade-table.column.ticker': '标的',
  'widget.trade-table.column.account': 'Account',
  'widget.trade-table.column.pnl': '盈亏',
  'widget.trade-table.column.direction': '方向',
  'widget.trade-table.column.setups': '策略',
  'widget.trade-table.column.mistakes': '失误',
  'widget.trade-table.empty': '该周期内无交易',
  'widget.trade-table.status.open': '持仓中',
  'widget.trade-table.na': '无',
  'widget.trade-table.unknown': '未知',

  'widget.trade-table.image-alt': '交易 {id} 预览',
  'widget.trade-table.fullscreen-title': '交易 {id} 图片',
  'widget.trade-table.fullscreen-alt': '交易 {id} 图片 {index}',
  'widget.trade-table.duration.days-hours': '{days}天{hours}小时',
  'widget.trade-table.duration.hours-mins': '{hours}小时{mins}分钟',
  'widget.trade-table.duration.mins': '{mins}分钟',
  'widget.trade-table.pagination.showing': '显示 {start}-{end},共 {total} 条',
  'widget.trade-table.pagination.prev': '← 上一页',
  'widget.trade-table.pagination.next': '下一页 →',
  'widget.trade-table.pagination.page': '第 {current} 页,共 {total} 页',

  
  'widget.pagination.showing': '显示 {start}-{end},共 {total} {items}',
  'widget.pagination.prev': '上一页',
  'widget.pagination.next': '下一页',
  'widget.pagination.page': '第 {current} 页,共 {total} 页',

  
  'widget.empty.no-data': '暂无数据',
  'widget.empty.no-trades': '该周期内无交易',
  'widget.empty.no-closed-trades': '该周期内无已平仓交易',
  'widget.empty.no-daily-data': '该周期内无每日数据',
  'widget.empty.no-weekly-data': '该周期内无每周数据',
  'widget.empty.no-monthly-data': '该周期内无每月数据',
  'widget.empty.no-quarterly-data': '该周期内无季度数据',
  'widget.empty.no-tag-data': '此期间没有可用的标签数据',
  'widget.empty.no-setup-data': '该周期内无策略数据',
  'widget.empty.no-mental-game-data': '在{period}中未找到心态评分',
  'widget.empty.no-technical-game-data': '在{period}中未找到技术评分',

  
  'widget.invalid-context.title': '上下文无效',
  'widget.invalid-context.default': '此{widgetType}组件需要复盘或交易笔记',
  'widget.invalid-context.monthly-quarterly-yearly':
    '此组件仅在月度、季度和年度复盘中可用',
  'widget.invalid-context.weekly-monthly-quarterly-yearly':
    '此组件仅在周度、月度、季度和年度复盘中可用',
  'widget.invalid-context.quarterly-yearly': '此组件仅在季度和年度复盘中可用',
  'widget.invalid-context.yearly-only': '此组件仅在年度复盘中可用',
  'widget.invalid-context.monthly-only': '此组件仅在月度复盘中可用',
  'widget.invalid-context.weekly-monthly': '此组件仅在周度和月度复盘中可用',
  'widget.invalid-context.review-note': '此组件需要复盘笔记',

  
  'widget.key-levels.title': '关键价位',
  'widget.key-levels.support': '支撑位',
  'widget.key-levels.resistance': '阻力位',
  'widget.key-levels.no-levels': '未定义价位',
  'widget.key-levels.price-placeholder': '价格...',
  'widget.key-levels.select-importance': '选择重要程度',
  'widget.key-levels.remove-level': '移除价位',
  'widget.key-levels.invalid-context':
    '关键价位组件需要日复盘、周复盘或月复盘笔记',
  'widget.key-levels.source.weekly': '周复盘',
  'widget.key-levels.source.monthly': '月复盘',
  'widget.key-levels.open-source-review': '打开 {label} 复盘',
  'widget.key-levels.importance.none': '无',
  'widget.key-levels.importance.high': '高',
  'widget.key-levels.importance.medium': '中',
  'widget.key-levels.importance.low': '低',

  
  'widget.pnlChart.name': '累计盈亏',
  'widget.pnlChart.description': '随时间累计的 P&L',

  'widget.longPnLChart.name': '多头盈亏',
  'widget.longPnLChart.description': '仅显示已平仓多头交易的累计盈亏曲线',
  'widget.shortPnLChart.name': '空头盈亏',
  'widget.shortPnLChart.description': '仅显示已平仓空头交易的累计盈亏曲线',
  'widget.performanceCalendar.name': '绩效日历',
  'widget.performanceCalendar.description': '每日 P&L 日历',

  'widget.dailyPerformance.name': '每日绩效',
  'widget.dailyPerformance.description': '每个交易日的 P&L',

  'widget.tradesChart.name': '交易图表',
  'widget.tradesChart.description': '每笔交易的 P&L',

  'widget.weekdayPerformance.name': '按星期绩效',
  'widget.weekdayPerformance.description': '一周中每天的 P&L',

  'widget.hourlyPerformance.name': '每小时绩效',
  'widget.hourlyPerformance.description': '一天中每小时的 P&L',

  'widget.tickerPerformance.name': '标的绩效',
  'widget.tickerPerformance.description': '按品种排名的表现柱状图',
  'widget.tradesChart.limit': '{count} 笔交易',
  'widget.drawdownChart.name': 'Drawdown Chart',
  'widget.drawdownChart.description': '距前期已实现 P&L 高点的回落',

  'widget.recentTrades.name': '近期交易',
  'widget.recentTrades.description': '显示最近交易的表格',
  'widget.recentTrades.date': '日期',
  'widget.recentTrades.ticker': '标的',
  'widget.recentTrades.direction': '方向',
  'widget.recentTrades.pnl': '盈亏',
  'widget.recentTrades.no-trades': '暂无交易记录',
  'widget.recentTrades.empty-submessage': '开始添加交易后将在此处显示',
  'widget.recentTrades.unknown': '未知',
  'widget.rollingWinRate.name': '滚动胜率',
  'widget.rollingWinRate.description': '近期交易的平均盈亏比',

  'widget.rollingStats.name': '滚动盈亏均值',
  'widget.rollingStats.description': '近期交易的平均盈利与亏损',

  
  
  

  'csv.mapper.title': '将列映射到交易字段',
  'csv.mapper.subtitle': '将您的列与相应的交易字段进行匹配。',
  'csv.mapper.do-not-import': '不导入',
  'csv.mapper.required-badge': '必填',
  'csv.mapper.required-label': '必填项',
  'csv.mapper.example': '示例:',
  'csv.mapper.mode.title': '每一行代表什么？',
  'csv.mapper.mode.help':
    '交易日志表格通常每行是一笔已平仓交易，并带有盈亏列。券商的订单历史会把每次买入和卖出分别列为一行。',

  'csv.mapper.asset-type.help':
    '选择此文件中的资产类型。这决定了必填字段和解析逻辑。',

  'csv.mapper.tip.title': '提示:映射更多字段',
  'csv.mapper.tip.desc':
    '映射佣金和盈亏等可选字段可以提供更完整的交易数据,并提高重复检测的准确性。',
  'csv.mapper.missing-fields': '{assetType}缺少必填字段:',
  'csv.mapper.summary.title': '摘要:',
  'csv.mapper.summary.of': '/',
  'csv.mapper.summary.columns-mapped': '列已映射',
  'csv.mapper.summary.all-mapped': '所有必填字段已映射',
  'csv.mapper.available-fields.title': '可用交易字段',
  'csv.mapper.available-fields.desc': '按类别组织,包含特定资产字段的说明',
  'csv.mapper.field.symbol': '代码',
  'csv.mapper.field.direction': '方向(做多/做空)',
  'csv.mapper.field.entry-time': '开仓时间',
  'csv.mapper.field.exit-time': '平仓时间',
  'csv.mapper.field.entry-price': '开仓价格',
  'csv.mapper.field.exit-price': '平仓价格',
  'csv.mapper.field.quantity': '数量',
  'csv.mapper.field.notes': '备注',
  'csv.mapper.field.order-id': '订单ID',
  'csv.mapper.field.account-id': '账户ID',
  'csv.mapper.help.options-required': '期权交易必填',
  'csv.mapper.help.option-type-required': '期权必填(看涨或看跌)',
  'csv.mapper.help.contract-size': '期权(通常为100)或期货的乘数',
  'csv.mapper.help.order-id': '用于汇总部分成交',
  'csv.mapper.help.asset-types': '股票、期权、期货、外汇、加密货币',
  'csv.mapper.help.status': '交易状态:持仓中或已平仓',
  'csv.mapper.category.required': '必填字段',
  'csv.mapper.category.optional-core': '可选核心字段',
  'csv.mapper.category.identifiers': '标识符',
  'csv.mapper.category.other': '其他',
  'csv.mapper.category.options': '期权字段',
  'csv.mapper.category.futures': '期货字段',

  

  

  'csv.template-import.label.share-code': '分享码',
  'csv.template-import.placeholder.share-code': 'JTT-v2-...',

  'csv.template-import.button.import': '导入模板',

  'csv.template-import.error.import-failed': '导入模板失败',

  'csv.export-template.label.share-code': '分享码',

  'csv.export-template.button.copied': '已复制!',
  'csv.export-template.button.copy': '复制到剪贴板',

  

  'csv.broker.label': '券商 / 导入格式',

  'csv.broker.remove-favorite-aria': '取消收藏',
  'csv.broker.set-favorite-aria': '设为收藏',
  'csv.broker.ibkr': '盈透证券 (IBKR)',
  'csv.broker.tradovate': 'Tradovate',
  'csv.broker.tradezero': 'TradeZero',
  'csv.broker.tradingview': 'TradingView 模拟交易',
  'csv.broker.bybit': 'Bybit (USDT 永续合约)',
  'csv.broker.blofin': 'Blofin',
  'csv.broker.hyperliquid': 'Hyperliquid (永续合约)',
  'csv.broker.sierrachart': 'SierraChart (期货)',
  'csv.broker.motivewave': 'MotiveWave',
  'csv.broker.fxreplay': 'FX Replay (Analytics)',
  'csv.broker.atas': 'ATAS(实时统计)',
  'csv.broker.rithmic': 'Rithmic',
  'csv.broker.jdr': 'MetaTrader 4 / 5',

  

  'csv.account-selector.favorite.remove': '取消收藏',
  'csv.account-selector.favorite.set': '设为收藏',

  

  

  'csv.results.successfully-imported-suffix': ' 笔交易',

  'csv.results.failed-to-import-prefix': '导入失败 ',
  'csv.results.failed-to-import-suffix': ' 行(详见下方)',

  'csv.results.pending-local-writes':
    '仍有 {count} 条交易笔记等待写入。Journalit 会核对已完成的写入，并保留未完成的投影以供恢复。',
  'csv.results.pending-title': '导入仍在同步中',

  'csv.results.complete': '导入完成',
  'csv.results.history-ready': '你的交易历史已准备就绪',
  'csv.results.completed-with-issues': '导入完成，但存在问题',
  'csv.results.failed': '导入失败',
  'csv.results.success.one': '成功导入 {count} 笔交易到账户:{account}',
  'csv.results.success.few': '成功导入 {count} 笔交易到账户:{account}',
  'csv.results.success.many': '成功导入 {count} 笔交易到账户:{account}',
  'csv.results.success.other': '成功导入 {count} 笔交易到账户:{account}',
  'csv.results.updated.one': '已更新 {count} 笔已有交易',
  'csv.results.updated.few': '已更新 {count} 笔已有交易',
  'csv.results.updated.many': '已更新 {count} 笔已有交易',
  'csv.results.updated.other': '已更新 {count} 笔已有交易',
  'csv.results.skipped.one': '跳过 {count} 笔重复交易(已存在于库中)',
  'csv.results.skipped.few': '跳过 {count} 笔重复交易(已存在于库中)',
  'csv.results.skipped.many': '跳过 {count} 笔重复交易(已存在于库中)',
  'csv.results.skipped.other': '跳过 {count} 笔重复交易(已存在于库中)',

  'csv.results.broker': '券商:{broker}',

  'csv.results.more-trades.one': '还有 {count} 笔交易...',
  'csv.results.more-trades.few': '还有 {count} 笔交易...',
  'csv.results.more-trades.many': '还有 {count} 笔交易...',
  'csv.results.more-trades.other': '还有 {count} 笔交易...',
  'csv.results.errors-header': 'CLICK TO SEE ERRORS ({count})',
  'csv.results.discord-note':
    'Optional: If you need help, click Copy report and paste it in Discord.',

  

  'csv.errors.copy-report': '复制报告',

  'csv.errors.copied': '已复制',
  'csv.errors.rows': '行:{rows}',
  'csv.errors.suggestion': '建议:',

  'csv.errors.raw-errors-limit': '显示前 {shown} 条,共 {total} 条错误',

  

  'csv.report.plugin-version': '插件版本:{version}',

  'csv.report.broker': '券商:{broker}',

  'csv.report.top-issues': '主要问题:',

  

  

  'csv.image-review.count': '{count} 张图片',

  
  
  
  'backend.title': '交易同步',
  'backend.description': '为受支持的经纪商设置 Trade Sync，自动保持仓库最新。',

  

  'trade-sync.gate.pro.description':
    'Trade Sync is a Pro feature. Upgrade to continue.',

  'trade-sync.gate.feature-unavailable.title': '功能不可用',
  'trade-sync.gate.feature-unavailable.description':
    '此同步功能未为您的 Pro 账户启用。如果问题仍然存在，请刷新状态或联系支持团队。',
  'trade-sync.trial.title': '自动管理您的交易日志',
  'trade-sync.trial.description': '使用 Journalit Pro，每周最多节省 7 小时。',
  'trade-sync.trial.benefit.sync': '自动同步交易',
  'trade-sync.trial.benefit.import': '随时随地导入交易',
  'trade-sync.trial.cta': '开始 14 天免费试用',
  'trade-sync.trial.existing-subscriber': '已经订阅？登录',
  'trade-sync.trial.eligibility': '免费试用仅限新订阅者。',

  

  'premium.gate.cta.continue-pro': '继续开通 PRO',

  'premium.gate.cta.refresh': 'Refresh status',

  'premium.gate.offline':
    'You appear to be offline. Activation requires internet.',
  'premium.gate.not-pro-yet':
    'You are signed in, but your account is not PRO yet. Upgrade and then refresh.',

  

  'backend.status.connected': '已连接',
  'backend.status.disconnected': '已断开',
  'backend.status.checking': '检查中...',

  
  'backend.register.title': '注册保管库',
  'backend.register.description': '将此保管库注册到后端服务器以进行同步',
  'backend.register.button': '注册保管库',
  'backend.register.registering': '注册中...',

  
  'backend.ftp.title': 'FTP 凭据',
  'backend.ftp.description':
    '创建 FTP 凭据以上传 MetaTrader 报告。系统将自动生成唯一用户名。',
  'backend.ftp.create-button': '创建 FTP 凭据',
  'backend.ftp.creating': '创建中...',

  

  'backend.sync.auto-sync': '启用自动同步',
  'backend.sync.auto-sync-desc': '自动从后端服务器同步交易',
  'backend.sync.auto-sync-info': '自动同步每小时检查一次新交易',
  'backend.sync.auto-sync-aria': '启用自动同步',

  'backend.sync.syncing': '同步中...',

  'backend.sync.last-result': '上次同步结果',
  'backend.sync.synced-trades': '已同步 {trades} 笔交易({files} 个新文件)',
  'backend.sync.no-new-trades': '没有新交易需要同步',
  'backend.sync.status': '同步状态',
  'backend.sync.last-sync': '上次同步',
  'backend.sync.total-syncs': '同步次数',
  'backend.sync.never': '从未',
  'backend.sync.invalid-date': '无效日期',

  
  'backend.notice.vault-registered': '✅ 保管库已注册到交易服务器',
  'backend.notice.sync-cancelled': '⏹️ 同步已取消',
  'backend.notice.sync-in-progress': '⚠️ 同步已在进行中',
  'backend.notice.account-info-failed': '❌ 获取账户信息失败',
  'backend.notice.sync-batch-progress':
    '⏳ 正在同步批次:{count} 笔交易(完成 {progress}%,剩余 {remaining})',
  'backend.notice.all-trades-synced': '✅ 所有 {count} 笔交易已同步',
  'backend.notice.account-created': '📊 已创建账户:{name}',
  'backend.notice.batch-complete':
    '⏳ 批次完成:{processed}/{total} 笔交易({progress}%)。继续中...',
  'backend.notice.sync-complete':
    '✅ 同步完成:处理 {total} 笔交易(新增 {newFiles},更新 {updated}),共 {accounts} 个账户',
  'backend.notice.sync-complete-no-trades': '✅ 同步完成 - 未发现新交易',
  'backend.notice.sync-failed': '❌ 同步失败:{error}',

  

  'backend.accounts.linked': '已关联 MT 账户',
  'backend.accounts.linked-desc': '从同步报告中检测到的 MetaTrader 账户',
  'backend.accounts.server-disconnected': '服务器已断开连接。请检查连接状态。',
  'backend.accounts.loading': '正在加载账户...',
  'backend.accounts.no-accounts': '未找到账户。',
  'backend.accounts.sync-to-detect': '同步一些交易以检测账户。',
  'backend.accounts.connect-to-see': '连接服务器并同步交易以查看账户。',
  'backend.accounts.account-id': '账户 ID',
  'backend.accounts.broker': '券商',
  'backend.accounts.first-seen': '首次发现',
  'backend.accounts.last-seen': '最后发现',
  'backend.accounts.refresh': '刷新账户',

  
  'backend.accounts.unlink-title': '取消关联 MetaTrader 账户',
  'backend.accounts.unlink': '取消关联',
  'backend.accounts.unlink-confirm':
    '取消关联 MetaTrader 账户 {accountId}？它将从 Trade Sync 中隐藏，并且在重新关联前会跳过未来导入。',
  'backend.accounts.unlink-success': 'MetaTrader 账户已取消关联',
  'backend.accounts.relink': '重新关联',
  'backend.accounts.relink-success': 'MetaTrader 账户已重新关联',
  'backend.accounts.ignored.title': '已取消关联的账户',
  'backend.accounts.ignored.count': '已隐藏 {count} 个',
  'backend.accounts.ignored.empty': '没有已取消关联的账户。',
  'backend.accounts.ignored-at': '取消关联时间',

  
  'backend.cards.connection.title': '连接状态',
  'backend.cards.connection.refresh': '刷新',
  'backend.cards.sync.title': '同步状态',
  'backend.cards.sync.last-sync': '上次同步',
  'backend.cards.sync.total': '总同步次数',
  'backend.cards.sync.button': '立即同步',
  'backend.cards.sync.cancel': '取消同步',
  'backend.cards.accounts.title': '账户',
  'backend.cards.accounts.linked': '已关联账户',
  'backend.cards.accounts.manage': '管理',

  
  'backend.section.setup.title': '设置与配置',
  'backend.section.sync.title': '同步设置',
  'backend.section.accounts.title': '账户管理',

  
  'settings.auth.feature.csv-import': 'Trade Import',
  'settings.auth.feature.ai-mapping': 'AI Trade Import 映射',
  'settings.auth.feature.trade-sync': '交易同步',
  'settings.auth.feature.economic-calendar': '财经日历',
  'settings.auth.feature.basic-tracking': '基础交易追踪',

  'settings.auth.feature.manual-entry': '手动录入交易',
  'settings.auth.feature.analytics-reviews': '分析与复盘',
  'settings.auth.feature.priority-support': '优先支持',

  
  'backend.sync.just-now': '刚刚',
  'backend.sync.minutes-ago': '{count} 分钟前',
  'backend.sync.hours-ago': '{count} 小时前',
  'backend.sync.days-ago': '{count} 天前',

  

  'csv.format': '导入格式:',

  'csv.button.export-template': '导出模板',
  'csv.button.delete-template': '删除模板',

  'csv.button.import-another': '导入另一个文件',

  

  

  'csv.broker-guide.tradovate.step-2':
    '点击"Orders"选项卡(不是 Performance 选项卡)',

  'csv.broker-guide.tradovate.warning.emphasis': '重要提示:',
  'csv.broker-guide.tradovate.warning.message':
    '仅使用 Orders 选项卡。Performance 选项卡不兼容。',

  

  'csv.broker-guide.ibkr.warning.emphasis': '必须使用 Orders',

  

  

  'csv.broker-guide.tradingview.step-3': '从下拉菜单中选择"Order History"',

  'csv.broker-guide.tradingview.warning.message':
    '其他导出类型(如 Positions 或 Orders)无法用于导入。',

  

  

  

  'csv.broker-guide.hyperliquid.warning.emphasis': '10,000 条记录限制。',

  

  'csv.broker-guide.sierrachart.step-1':
    '打开交易活动日志(Trade → Trade Activity Log,或 Ctrl+Shift+A)',

  

  

  

  'csv.broker-guide.atas.warning.emphasis': '重要:',
  'csv.broker-guide.atas.warning.message':
    '请勿编辑导出的文件。Journalit 会保留 "Journal" 工作表中的交易边界,并在可用时使用 "Executions" 工作表中的匹配成交来补全手续费。',

  

  'csv.broker-guide.rithmic.warning.emphasis': '重要:',

  

  'csv.broker-guide.jdr.warning.emphasis': '重要:',

  
  'csv.date-format.auto-detect': '自动检测(推荐用于ISO/标准格式)',
  'csv.date-format.us-date': '美国日期:12/25/2024(Schwab、Fidelity、E*TRADE)',
  'csv.date-format.us-datetime': '美国日期时间:12/25/2024 14:30:00(Webull)',
  'csv.date-format.us-short': '美国短日期:1/5/2024(TradeZero)',
  'csv.date-format.us-short-datetime': '美国短日期时间:1/5/2024 14:30:00',
  'csv.date-format.iso-datetime':
    'ISO日期时间:2024-12-25 14:30:00(Bybit、Tradovate)',
  'csv.date-format.iso-date': 'ISO日期:2024-12-25(Interactive Brokers)',
  'csv.date-format.eu-date': '欧洲日期:25/12/2024(日/月/年)',
  'csv.date-format.eu-datetime': '欧洲日期时间:25/12/2024 14:30:00',
  'csv.date-format.eu-dash': '欧洲短横线日期:25-12-2024',
  'csv.date-format.eu-dash-datetime': '欧洲短横线日期时间:25-12-2024 14:30:00',

  
  
  
  'settings.tab.general': '通用',
  'settings.tab.reviews': '复盘',

  'settings.tab.customization': '自定义',
  'settings.tab.journal-setup': '日志',
  'settings.tab.backend': '交易同步',
  'settings.tab.trading': '交易默认设置',
  'settings.tab.sync': '账户与同步',
  'settings.tab.accounts': '账户',

  
  
  
  'settings.ftp.title': 'FTP凭证',
  'settings.ftp.title-metatrader': 'MetaTrader的FTP凭证',
  'settings.ftp.loading': '正在加载FTP凭证...',
  'settings.ftp.info-message': '使用这些凭证将MetaTrader连接到Journalit',
  'settings.ftp.label.server': 'FTP服务器:',
  'settings.ftp.label.login': 'FTP登录名:',
  'settings.ftp.label.password': 'FTP密码:',
  'settings.ftp.aria.copy-server': '复制FTP服务器',
  'settings.ftp.aria.copy-login': '复制FTP登录名',
  'settings.ftp.aria.copy-password': '复制密码',
  'settings.ftp.aria.password-unavailable': '密码不可用',
  'settings.ftp.aria.password-hidden': '密码已隐藏',
  'settings.ftp.aria.hide-password': '隐藏密码',
  'settings.ftp.aria.show-password': '显示密码',
  'settings.ftp.notice.password-masked':
    '密码已加密显示以确保安全。使用复制按钮复制密码。',
  'settings.ftp.notice.password-save': '请立即保存此密码--之后将无法再次查看',
  'settings.ftp.button.reset': '重置FTP密码',
  'settings.ftp.button.resetting': '正在重置密码...',
  'settings.ftp.reset-hint': '如果丢失了当前密码,可生成新的FTP密码',
  'settings.ftp.instructions.title': 'MetaTrader 4设置说明:',
  'settings.ftp.instructions.step1': '打开MetaTrader 4 (MT4)',
  'settings.ftp.instructions.step2': '进入工具菜单',
  'settings.ftp.instructions.step3': '选择"选项"',
  'settings.ftp.instructions.step4': '点击"发布"选项卡',
  'settings.ftp.instructions.step5': '启用"被动模式"',
  'settings.ftp.instructions.step6': '输入上述凭证',
  'settings.ftp.no-credentials': '未找到FTP凭证。请登录以生成凭证。',
  'settings.ftp.error.reset-failed': '重置密码失败',

  
  
  

  'settings.auth.status-offline': '离线',
  'settings.auth.status-online': '在线',

  'settings.auth.signed-in': '已登录',
  'settings.auth.sign-in-up': '登录/注册',
  'settings.auth.sign-out': '登出',

  'settings.auth.subscription-features': '订阅功能',

  'settings.auth.offline-mode': '离线模式',

  
  'settings.auth.guest': '访客',

  'settings.auth.your-plan': '您的方案',

  'settings.auth.manage-subscription': '管理订阅',

  
  
  
  'settings.account-linking.title': '更改账户关联',
  'settings.account-linking.description': '将MetaTrader账户关联到Obsidian账户',
  'settings.account-linking.source.title': '源MT账户',
  'settings.account-linking.source.description':
    '选择要重新关联的MetaTrader账户',
  'settings.account-linking.source.placeholder': '选择源账户...',
  'settings.account-linking.target.title': '目标Obsidian账户',
  'settings.account-linking.target.description': '选择要关联的Obsidian账户',
  'settings.account-linking.target.placeholder': '选择目标账户...',
  'settings.account-linking.button.processing': '处理中...',
  'settings.account-linking.button.relink': '重新关联账户',
  'settings.account-linking.warning': '这将把所有交易从源账户移动到目标账户',
  'settings.account-linking.success.relinked':
    '已将{count}个账户从{source}重新关联到{target}',
  'settings.account-linking.error.select-both': '请同时选择源账户和目标账户',
  'settings.account-linking.error.source-not-found': '未找到源账户',
  'settings.account-linking.error.target-not-found': '未找到目标账户',
  'settings.account-linking.error.already-linked': '这些账户已经关联',
  'settings.account-linking.error.service-manager': '服务管理器不可用',
  'settings.account-linking.error.backend-service': '后端服务不可用',
  'settings.account-linking.error.relink-failed': '账户重新关联失败:{error}',

  
  
  
  'settings.general.title': '常规设置',
  'settings.general.docs': '文档',
  'settings.general.discord': 'Discord',
  'settings.general.github': 'GitHub',

  'settings.general.currency': '货币',
  'settings.general.currency-desc': '选择用于显示金额的货币',
  'settings.general.currency-aria': '选择显示货币',
  'settings.general.currency-changed': '货币已更改为 {currency}',
  'settings.general.currency-save-failed': '保存货币偏好失败',
  'settings.general.path-change.title': '交易日志文件夹位置已更改',
  'settings.general.path-change.new-trades-title':
    '新交易将创建在新的文件夹位置',
  'settings.general.path-change.new-trades-desc': '所有未来的交易日志将使用:',
  'settings.general.path-change.manual-title': '需要手动操作:',
  'settings.general.path-change.manual-desc':
    '您当前文件夹中已有交易。要移动它们:',
  'settings.general.path-change.step.open-explorer': '打开您的库文件资源管理器',
  'settings.general.path-change.step.find-folder-prefix': '找到你的',
  'settings.general.path-change.step.find-folder-suffix': '文件夹',
  'settings.general.path-change.step.drag-drop': '方便时将其拖放到新的位置',
  'settings.general.path-change.manual-note':
    '这样您可以完全控制文件移动的时间和方式。',
  'settings.general.path-change.sync-title': '同步映射更新:',
  'settings.general.path-change.sync-desc':
    '插件会自动更新您的交易同步映射以反映新的文件夹路径,确保同步交易与后端记录保持连接。',
  'settings.general.path-change.button.cancel': '取消',
  'settings.general.path-change.button.confirm': '我已了解',
  'settings.general.display-name': '显示名称',
  'settings.general.display-name-desc': '在欢迎消息中显示的名称',
  'settings.general.display-name-placeholder': '添加新的显示名称...',
  'settings.general.display-name-aria': '欢迎消息的显示名称',
  'settings.general.display-name-confirm-aria': '确认更改显示名称',
  'settings.general.display-name-cancel-aria': '取消更改显示名称',
  'settings.general.display-name-saved': '显示名称已保存为"{name}"',
  'settings.general.display-name-cleared': '显示名称已清除',
  'settings.general.display-name-save-failed': '保存显示名称失败',
  'settings.general.privacy-mode': '隐私模式',
  'settings.general.privacy-mode-desc':
    '在界面中隐藏敏感的交易、账户、价格和绩效数值，不会更改已保存的数据。',
  'settings.general.privacy-mode-aria': '切换隐私模式',

  'settings.general.appearance': '外观',
  'settings.general.accent-color': '强调色',
  'settings.general.accent-color-desc':
    'Journalit 按钮、开关和高亮的颜色。仅当 Obsidian 使用默认强调色时才会使用 Journalit 强调色；你在 Obsidian 外观设置中选择的强调色或主题始终优先。',
  'settings.general.accent-color-journalit': 'Journalit 强调色（默认）',
  'settings.general.accent-color-obsidian': '跟随 Obsidian 强调色',
  'settings.general.home-view-settings': '主页视图设置',
  'settings.general.home-auto-open': '主页视图自动打开',
  'settings.general.home-auto-open-desc':
    '控制 Obsidian 启动时主页视图的打开方式',
  'settings.general.home-auto-open-always': '始终打开并聚焦(默认)',
  'settings.general.home-auto-open-ifnone': '仅在无活动文件时打开',
  'settings.general.home-auto-open-never': '从不(仅手动打开)',
  'settings.general.home-auto-open-aria': '选择主页启动行为',
  'settings.general.home-startup-changed': '主页启动行为已更改为{behavior}',
  'settings.general.filter-recent': '筛选最近项目为 Journalit 文件',
  'settings.general.filter-recent-desc': '在最近文件部分仅显示 Journalit 文件',
  'settings.general.filter-recent-aria': '筛选最近项目为 Journalit 文件',
  'settings.general.filter-recent-toggled': '最近文件筛选已{status}',
  'settings.general.home-widget-opacity': '小组件不透明度',
  'settings.general.home-widget-opacity-desc':
    '使用背景图片时的小组件背景：0% 为完全透明，100% 为完全不透明。应用于当前主题；浅色和深色主题的数值分别保存。',
  'settings.general.home-widget-opacity-save-failed':
    '无法保存小组件不透明度，请重试。',
  'settings.general.home-background': '主页背景图片',
  'settings.general.home-background-desc':
    '使用仓库中的图片，或从电脑选择图片并复制到仓库。',
  'settings.general.home-background-dashboard': '在 Dashboard 中也显示背景',
  'settings.general.home-background-dashboard-desc':
    '在 Dashboard 模式中使用相同的背景图片。',
  'settings.general.home-background-dashboard-aria':
    '在 Dashboard 中显示主页背景',

  'settings.general.home-background-choose': '选择图片',
  'settings.general.home-background-clear': '清除',

  'settings.general.home-background-invalid-file': '请选择受支持的图片文件。',
  'settings.general.home-background-saved': '主页背景图片已保存。',
  'settings.general.home-background-cleared': '主页背景图片已清除。',
  'settings.general.home-background-save-failed': '无法保存主页背景图片。',
  'settings.general.folder-section': '文件夹位置与图片路径',
  'settings.general.journal-folder': '日志文件夹位置',
  'settings.general.journal-folder-desc': '所有交易日志文件的根文件夹',
  'settings.general.journal-folder-desc-2': '谨慎更改 - 现有文件需要手动移动',
  'settings.general.journal-folder-placeholder': '选择自定义文件夹...',
  'settings.general.journal-folder-default': '默认:Journalit',
  'settings.general.update-image-paths': '更新图片路径',
  'settings.general.update-image-paths-desc':
    '更新所有交易笔记中的图片路径以匹配当前文件夹位置',
  'settings.general.update-image-paths-updating': '正在更新...',
  'settings.general.update-image-paths-match':
    '所有图片路径已与当前文件夹位置匹配',
  'settings.general.folder-updated': '日志文件夹已更新为"{path}"',
  'settings.general.folder-update-failed': '更新路径失败:{error}',
  'settings.general.update-image-paths-success': '已更新 {count} 个图片路径',
  'settings.general.update-image-paths-no-update': '无需更新图片路径',
  'settings.general.update-image-paths-errors':
    '已更新 {updated} 个路径,{failed} 个错误',
  'settings.general.update-image-paths-failed': '更新图片路径失败:{error}',
  'settings.general.trade-settings': '交易设置',
  'settings.general.auto-open-trades': '自动打开新建交易',
  'settings.general.auto-open-trades-desc': '自动打开新创建的交易笔记',
  'settings.general.auto-open-trades-aria': '自动打开新建交易',
  'settings.general.auto-open-toggled': '自动打开新建交易已{status}',
  'settings.general.date-format': '日期格式',
  'settings.general.date-format-desc': '交易笔记文件名中使用的日期格式',
  'settings.general.date-format-aria': '选择交易笔记的日期格式',
  'settings.general.date-format-ddmmyy': '日/月/年 (31/12/23)',
  'settings.general.date-format-mmddyy': '月/日/年 (12/31/23)',
  'settings.general.date-format-yymmdd': '年/月/日 (23/12/31)',
  'settings.general.date-format-changed': '日期格式已更改为{format}',
  'settings.general.use-24-hour-time': '使用24小时制',
  'settings.general.use-24-hour-time-desc':
    '以24小时制显示时间(14:30)而非12小时制(下午2:30)',
  'settings.general.use-24-hour-time-aria': '使用24小时制',
  'settings.general.show-seconds': '在交易时间中显示秒',
  'settings.general.show-seconds-desc': '输入交易进场和出场时间时显示秒。',
  'settings.general.show-seconds-aria': '在交易时间中显示秒',
  'settings.general.skip-weekends': '排除周末',
  'settings.general.skip-weekends-desc':
    '启用后，Journalit 会在整个插件中将周末视为非交易日。如果你在周六或周日交易或复盘，请关闭此选项。',
  'settings.general.skip-weekends-aria': '在 Journalit 中排除周末',
  'settings.general.skip-weekends-toggled': '周末排除已{status}',
  'settings.general.week-start': '周起始日',
  'settings.general.week-start-desc': '选择交易周的起始日,影响每周回顾和报告。',
  'settings.general.week-start-aria': '选择周起始日',
  'settings.general.week-start-changed': '周起始日已更改为{day}',
  'settings.general.analytics-date-basis': '分析日期基准',
  'settings.general.analytics-date-basis-desc':
    '更适合波段交易者。分析可使用入场日期或最终出场日期。出场日期模式只统计已关闭交易，并且直接 PnL 交易必须提供出场日期。',
  'settings.general.analytics-date-basis-aria': '选择分析日期基准',
  'settings.general.analytics-date-basis-entry': '入场日期',
  'settings.general.analytics-date-basis-exit': '出场日期',
  'settings.general.analytics-date-basis-changed':
    '分析日期基准已更改为{basis}',
  'settings.general.dollar-value-input': '以金额输入仓位',
  'settings.general.dollar-value-input-desc': '以金额而非股数/合约数输入仓位',
  'settings.general.dollar-value-input-aria': '以金额输入仓位',
  'settings.general.dollar-value-input-toggled': '仓位输入方式:{mode}',
  'settings.general.dollar-value': '金额',
  'settings.general.quantity': '数量',
  'settings.general.mae-mfe-input-mode': 'MAE/MFE 输入模式',
  'settings.general.mae-mfe-input-mode-desc':
    '选择如何输入最大不利偏移/最大有利偏移值',
  'settings.general.mae-mfe-input-mode-desc-price':
    '输入为价格水平(例如交易期间的最低/最高价)',
  'settings.general.mae-mfe-input-mode-desc-dollar':
    '输入为金额(例如交易期间的最大回撤/盈利)',
  'settings.general.mae-mfe-input-mode-aria': '选择 MAE/MFE 输入模式',
  'settings.general.mae-mfe-input-mode-price': '价格水平',
  'settings.general.mae-mfe-input-mode-dollar': '金额',
  'settings.general.mae-mfe-display-unit': 'MAE/MFE 显示单位',
  'settings.general.mae-mfe-display-unit-desc':
    '在分析和交易视图中以货币或期货跳动点显示 MAE/MFE。跳动点模式会自动重新计算数据完整的现有期货交易，而不会修改已保存的交易数据。',
  'settings.general.mae-mfe-display-unit-aria': '选择 MAE/MFE 显示单位',
  'settings.general.mae-mfe-display-dollar': '货币',
  'settings.general.mae-mfe-display-ticks': '跳动点',
  'common.ticks': '跳动点',
  'dashboard.mae-mfe-ticks.partial-coverage':
    '仅 {eligible}/{total} 笔交易包含期货跳动点数据。此指标会排除不符合条件的交易。',
  'settings.general.cutoff-time': '交易日截止时间',
  'settings.general.cutoff-time-desc': '新交易日开始的时间(用于隔夜交易时段)',
  'settings.general.cutoff-time-aria': '交易日截止时间',
  'settings.general.cutoff-time-changed': '交易日截止时间已更改为{time}',
  'settings.general.break-even-threshold-mode': 'Break-even Threshold Type',
  'settings.general.break-even-threshold-mode-desc':
    "Choose whether break-even is determined by a fixed P&L range or by a percentage of each trade account's current balance.",
  'settings.general.break-even-mode-fixed': 'Fixed amount range',
  'settings.general.break-even-mode-percent':
    'Percentage of current account balance',
  'settings.general.break-even-percent': 'Break-even Percentage',
  'settings.general.break-even-percent-desc':
    'Symmetric threshold around zero (±X% of current account balance). Trades without a resolvable account balance are excluded from win/loss stats.',
  'settings.general.break-even-percent-placeholder': '0.05',
  'settings.general.break-even-percent-aria':
    'Break-even percentage of current account balance',
  'settings.general.break-even-range': '盈亏平衡范围',
  'settings.general.break-even-range-desc': '视为盈亏平衡交易的盈亏范围',
  'settings.general.break-even-min-placeholder': '最小值',
  'settings.general.break-even-max-placeholder': '最大值',
  'settings.general.break-even-min-aria': '盈亏平衡范围最小值',
  'settings.general.break-even-max-aria': '盈亏平衡范围最大值',
  'settings.general.break-even-to': '至',
  'settings.general.break-even-updated': '盈亏平衡范围已更新',
  'settings.general.default-risk': '默认风险金额',
  'settings.general.default-risk-desc': '新交易的预填风险金额',
  'settings.general.default-risk-aria': '默认风险金额',
  'settings.general.display-r-multiples': '显示R倍数',
  'settings.general.display-r-multiples-desc':
    '将盈亏显示为R倍数(基于初始风险)',
  'settings.general.display-r-multiples-aria': '显示R倍数',
  'settings.general.display-r-multiples-toggled': 'R倍数显示已{status}',
  'settings.general.notification-settings': '通知设置',
  'settings.general.sync-notifications': '同步通知',
  'settings.general.sync-notifications-desc': '同步交易时显示通知',
  'settings.general.sync-notifications-aria': '启用同步通知',
  'settings.general.sync-notifications-toggled': '同步通知已{status}',
  'settings.general.new-trade-notifications': '新交易通知',
  'settings.general.new-trade-notifications-desc': '创建新交易时显示通知',
  'settings.general.new-trade-notifications-aria': '启用新交易通知',
  'settings.general.new-trade-notifications-toggled': '新交易通知已{status}',
  'settings.general.update-notifications': '显示更新通知',
  'settings.general.update-notifications-desc':
    '每天检查 GitHub 上公开的 Journalit 发布信息，并在有更新版本时通知你',
  'settings.general.update-notifications-aria': '显示更新通知',
  'settings.general.update-notifications-toggled': '更新通知已{status}',
  'settings.general.data-management': '数据管理 & 隐私',
  'settings.general.backup-restore-section': '备份、还原和重置',
  'settings.general.export-settings': '导出设置',
  'settings.general.export-settings-desc': '将所有插件设置导出为 JSON 文件',
  'settings.general.export-settings-exporting': '正在导出...',
  'settings.general.import-settings': '导入设置',
  'settings.general.import-settings-desc': '从之前导出的 JSON 文件导入设置',
  'settings.general.import-settings-importing': '正在导入...',
  'settings.general.reset-to-defaults': '恢复默认设置',
  'settings.general.reset-to-defaults-desc': '将所有设置重置为默认值',
  'settings.general.reset-to-defaults-warning':
    '这将重置所有自定义设置。您的交易笔记不会受到影响。',
  'settings.general.reset-to-defaults-resetting': '正在重置...',
  'settings.general.enabled': '启用',
  'settings.general.disabled': '禁用',

  'settings.general.include-copy-accounts-analytics':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-analytics-desc':
    'When enabled, all-account trading analytics include derived copy-account results and count them as account-level trades.',
  'settings.general.include-copy-accounts-analytics-aria':
    'Include copy accounts in all-account analytics',
  'settings.general.include-copy-accounts-toggled':
    'Copy accounts in all-account analytics {status}',
  'settings.general.include-unrealized-pnl': '在分析中包含未实现盈亏',
  'settings.general.include-unrealized-pnl-desc':
    '启用后，净盈亏总额将包含带价格快照的持仓的未实现盈亏，并与已实现结果分开显示。胜率、连胜等交易结果统计仍仅基于已实现盈亏。',
  'settings.general.include-unrealized-pnl-aria': '在分析中包含未实现盈亏',
  'settings.general.include-unrealized-pnl-toggled':
    '分析中的未实现盈亏{status}',
  
  
  
  'settings.reviews.drc': '每日报告卡',
  'settings.reviews.weekly': '周度复盘',
  'settings.reviews.monthly': '月度复盘',
  'settings.reviews.quarterly': '季度复盘',
  'settings.reviews.yearly': '年度复盘',
  'settings.reviews.default-templates': '默认布局',

  'settings.reviews.trade-template': '交易布局',
  'settings.reviews.trade-template-desc': '用于新建交易笔记的布局',
  'settings.reviews.drc-template': '每日报告卡布局',
  'settings.reviews.drc-template-desc': '用于新建每日报告卡的布局',
  'settings.reviews.weekly-template': '周度布局',
  'settings.reviews.weekly-template-desc': '用于新建周度复盘的布局',
  'settings.reviews.monthly-template': '月度布局',
  'settings.reviews.monthly-template-desc': '用于新建月度复盘的布局',
  'settings.reviews.quarterly-template': '季度布局',
  'settings.reviews.quarterly-template-desc': '用于新建季度复盘的布局',
  'settings.reviews.yearly-template': '年度布局',
  'settings.reviews.yearly-template-desc': '用于新建年度复盘的布局',
  'settings.reviews.template-builder': '布局构建器',
  'settings.reviews.template-builder-desc': '创建和自定义笔记布局',
  'settings.reviews.open-builder': '打开布局构建器',
  'settings.general.review-links-new-tab': '在新标签页中打开复盘小组件链接',
  'settings.general.review-links-new-tab-desc':
    '关闭后，链接会替换当前标签页。',
  'settings.general.review-links-new-tab-aria':
    '在新标签页中打开复盘小组件的笔记链接',
  'settings.general.tab-behavior': '标签页行为',
  'settings.reviews.recurring-goals': '周期性目标',
  'settings.reviews.recurring-goals-desc': '每日或每周重复的目标',
  'settings.reviews.daily-goals': '每日目标',
  'settings.reviews.daily-goal-placeholder': '添加周期性每日目标...',
  'settings.reviews.weekly-goals': '每周目标',
  'settings.reviews.weekly-goal-placeholder': '添加周期性每周目标...',
  'settings.reviews.pre-trade-checklist': 'DRC 交易前检查清单',
  'settings.reviews.pre-trade-checklist-desc': '入场前需要检查的事项',
  'settings.reviews.checklist-placeholder': '添加检查项...',
  'settings.reviews.weekly-checklist': '每周准备检查清单',
  'settings.reviews.weekly-checklist-desc':
    '定义会自动出现在每个新建周复盘中的检查清单项目。这些项目会在创建周复盘时复制，并可按周编辑。',
  'settings.reviews.weekly-checklist-placeholder': '添加每周检查清单项目...',
  'settings.reviews.auto-create': '自动创建复盘',
  'settings.reviews.global-auto-create': '全局自动创建复盘',
  'settings.reviews.global-auto-create-desc':
    '导航到没有复盘的日期时自动创建复盘笔记',
  'settings.reviews.global-auto-create-aria': '全局自动创建复盘',
  'settings.reviews.auto-create-drc-nav': '导航时自动创建每日报告卡',
  'settings.reviews.auto-create-drc-nav-desc':
    '导航到没有每日报告卡的日期时自动创建',
  'settings.reviews.auto-create-drc-nav-aria': '导航时自动创建每日报告卡',
  'settings.reviews.auto-create-weekly-nav': '导航时自动创建周度复盘',
  'settings.reviews.auto-create-weekly-nav-desc':
    '导航到没有周度复盘的周时自动创建',
  'settings.reviews.auto-create-weekly-nav-aria': '导航时自动创建周度复盘',
  'settings.reviews.auto-create-monthly-nav': '导航时自动创建月度复盘',
  'settings.reviews.auto-create-monthly-nav-desc':
    '导航到没有月度复盘的月份时自动创建',
  'settings.reviews.auto-create-monthly-nav-aria': '导航时自动创建月度复盘',
  'settings.reviews.auto-create-quarterly-nav': '导航时自动创建季度复盘',
  'settings.reviews.auto-create-quarterly-nav-desc':
    '导航到没有季度复盘的季度时自动创建',
  'settings.reviews.auto-create-quarterly-nav-aria': '导航时自动创建季度复盘',
  'settings.reviews.auto-create-yearly-nav': '导航时自动创建年度复盘',
  'settings.reviews.auto-create-yearly-nav-desc':
    '导航到没有年度复盘的年份时自动创建',
  'settings.reviews.auto-create-yearly-nav-aria': '导航时自动创建年度复盘',

  'settings.reviews.notice.builder-not-found': '未找到布局构建器',
  'settings.reviews.notice.global-auto-create': '全局自动创建已{status}',
  'settings.reviews.notice.auto-create-nav': '导航时自动创建{type}已{status}',
  'settings.reviews.daily.checklist-title': '交易前检查项',

  'settings.reviews.daily.questions-title': '复盘问题',

  'settings.reviews.daily.timeframes-title': '预测时间周期',

  'settings.reviews.daily.timeframes-placeholder':
    '新时间周期(如:15分钟、1小时)',

  
  
  
  'settings.weekly.review-questions': '复盘问题',

  'settings.weekly.forecast-timeframes': '预测时间周期',

  
  
  

  
  
  
  'settings.reset.modal.title': '重置设置为默认值?',
  'settings.reset.modal.explanation': '这将重置所有插件设置。以下内容将被清除:',
  'settings.reset.modal.item-custom-options': '自定义代码、策略、错误和标签',
  'settings.reset.modal.item-account-settings': '账户设置和元数据',
  'settings.reset.modal.item-dashboard-layouts': '仪表盘布局',
  'settings.reset.modal.item-symbol-mappings': '代码映射',
  'settings.reset.modal.item-csv-templates': 'Trade Import 模板',
  'settings.reset.modal.item-other': '所有其他自定义设置',
  'settings.reset.modal.backup-note': '重置前将创建备份。',
  'settings.reset.modal.warning': '您的交易笔记不会受到影响。',
  'settings.reset.backup-failed.title': '备份失败',
  'settings.reset.backup-failed.message': '重置前创建备份失败。',
  'settings.reset.backup-failed.warning': '是否要在没有备份的情况下继续?',

  
  
  
  'settings.shared.timeframes.title': '预测时间周期',

  'settings.shared.timeframes.placeholder': '新时间周期(例如:15M、5M)',

  
  
  

  
  
  
  'shared.empty-state.message': '暂无数据',

  
  
  
  'settings.customization.title': '自定义设置',
  'settings.customization.description':
    '自定义代码、交易设置、失误、标签及其他选项。',
  'settings.customization.trade-form-layout.description':
    '选择交易表单中显示的字段和区块。',
  'settings.customization.trade-form-layout.button': '自定义布局',
  'settings.customization.tickers-symbols': '代码/品种',
  'settings.customization.symbol-mappings': '代码映射',

  'settings.customization.setups': '交易设置',
  'settings.customization.mistakes': '失误',
  'settings.customization.tags': '标签',
  'settings.customization.events': '事件',

  'settings.customization.options.confirm.update-notes': '确定(更新笔记)',
  'settings.customization.options.confirm.save-name': '仅保存名称',
  'settings.customization.options.confirm.cancel': '取消操作',
  'settings.customization.options.type.tickers': '代码',
  'settings.customization.options.type.accounts': '账户',
  'settings.customization.options.type.account-types': '账户类型',
  'settings.customization.options.type.setups': '交易设置',
  'settings.customization.options.type.mistakes': '失误',
  'settings.customization.options.type.tags': '标签',
  'settings.customization.options.type.events': '事件',
  'settings.customization.options.asset-type.cfd': '差价合约',
  'settings.customization.options.notice.empty-name': '请输入名称',
  'settings.customization.options.notice.invalid-ticker': '代码格式无效',
  'settings.customization.options.notice.added': '已将"{newValue}"添加到{type}',
  'settings.customization.options.notice.duplicate': '选项 "{newValue}" 已存在',
  'settings.customization.options.notice.asset-type-required': '请选择资产类型',
  'settings.customization.options.notice.updated-with-notes':
    '已将"{oldValue}"更新为"{newValue}",并更新了{count}条交易笔记',
  'settings.customization.options.notice.updated':
    '已将"{oldValue}"更新为"{newValue}"',
  'settings.customization.options.confirm.rename-message':
    '是否将所有引用"{oldValue}"的交易笔记更新为"{newValue}"?',
  'settings.customization.options.notice.cannot-delete-archived':
    '无法删除"已归档"账户类型--该类型为系统保留,用于归档账户。',
  'settings.customization.options.confirm.remove-message':
    '确定要删除"{option}"吗?',
  'settings.customization.options.notice.removed': '已删除选项"{option}"',
  'settings.customization.options.notice.remove-failed': '删除选项失败:{error}',
  'settings.customization.options.confirm.reset-message':
    '确定要将所有{type}重置为默认选项吗?此操作无法撤销。',
  'settings.customization.options.notice.reset-success':
    '已将{type}重置为默认选项',
  'settings.customization.options.notice.no-options-to-reset':
    '{type}的默认选项已在使用中',
  'settings.customization.options.notice.mapping-symbols-required':
    '映射需要填写两个代码',
  'settings.customization.options.notice.mapping-added':
    '已添加映射:{imported} → {base}',
  'settings.customization.options.notice.mapping-add-failed':
    '添加映射失败:{error}',
  'settings.customization.options.notice.mapping-deleted':
    '已删除映射:{symbol}',
  'settings.customization.options.notice.mapping-delete-failed':
    '删除映射失败:{error}',
  'settings.customization.options.empty-state': '尚未添加任何{type}。',
  'settings.customization.options.label.save-changes': '保存更改',
  'settings.customization.options.label.cancel-editing': '取消编辑',
  'settings.customization.options.label.edit-option': '编辑{option}',
  'settings.customization.options.label.remove-option': '删除{option}',
  'settings.customization.options.placeholder.select-asset': '选择资产类型',
  'settings.customization.options.field.pip-size': '点值大小',
  'settings.customization.options.field.priority': '优先级:',
  'settings.customization.options.field.default-event-notes': '默认事件备注：',
  'settings.customization.options.placeholder.default-event-notes':
    '选择此事件时自动填充的备注',
  'settings.customization.options.aria.confirm-add': '确认添加{type}',
  'settings.customization.options.label.locked': '已锁定',
  'settings.customization.options.label.archived-reserved': '已归档(保留)',
  'settings.customization.options.aria.reset-all': '删除所有自定义{type}',
  'settings.customization.options.button.reset-all': '重置所有{type}',
  'settings.customization.options.placeholder.new-name': '新{type}名称',
  'settings.customization.options.placeholder.dollar-per-point': '美元/点',
  'settings.customization.options.placeholder.tick-size': '最小变动单位',
  'settings.customization.options.placeholder.tick-value': '每跳价值',
  'settings.customization.options.placeholder.lot-size': '手数',
  'settings.customization.options.placeholder.pip-value': '点值',
  'settings.customization.options.placeholder.pip-size': '点值大小',
  'settings.customization.options.field.optional': '(可选)',
  'settings.customization.options.mapping.description':
    '将经纪商代码映射到您偏好的显示名称',
  'settings.customization.options.mapping.auto-detected': '自动检测',
  'settings.customization.options.mapping.manual': '手动',
  'settings.customization.options.mapping.created-at': '创建于 {date}',
  'settings.customization.options.mapping.no-mappings': '暂无代码映射',
  'settings.customization.options.mapping.placeholder-imported':
    '导入的代码(如 EURUSD.i)',
  'settings.customization.options.mapping.placeholder-base':
    '显示名称(如 EURUSD)',
  'settings.customization.options.mapping.button-add': '添加映射',
  'settings.customization.options.placeholder.add-new': '添加新{type}',
  'settings.customization.options.aria.delete-mapping': '删除映射',
  'settings.customization.options.instrument.specs-futures':
    '期货:${dollar}/点,{tick}跳,${value}跳价值',
  'settings.customization.options.instrument.specs-forex':
    '外汇:{lot}手,{pip}点值,{size}点',
  'settings.customization.options.instrument.built-in': '(内置)',
  'settings.customization.options.instrument.mapped-to':
    '映射到 {base}(使用 {base} 的规格)',
  'settings.customization.options.instrument.no-specs': '(未设置规格)',
  'settings.customization.custom-fields.description':
    '为每笔交易添加你自己的字段，例如交易时段、周期或形态评级。它们会显示在交易表单的“高级”标签页中，保存到交易笔记的 frontmatter，并可成为交易记录中可排序、可筛选的列。',
  'settings.customization.custom-fields.title': '自定义字段({count})',
  'settings.customization.custom-fields.manage-desc': '管理自定义交易表单字段',
  'settings.customization.custom-fields.type-dropdown': '下拉选择',
  'settings.customization.custom-fields.type-multiselect': '多选',
  'settings.customization.custom-fields.type-suffix': '字段',
  'settings.customization.custom-fields.option-count.one': '{count}个选项',
  'settings.customization.custom-fields.option-count.few': '{count}个选项',
  'settings.customization.custom-fields.option-count.many': '{count}个选项',
  'settings.customization.custom-fields.option-count.other': '{count}个选项',
  'settings.customization.custom-fields.no-fields': '未定义自定义字段',
  'settings.customization.custom-fields.no-fields-desc':
    '先从一个你之后真的会复盘的字段开始，例如你交易的时段，或该形态与计划的吻合程度。',
  'settings.customization.custom-fields.add-new': '添加新字段',

  'settings.customization.custom-fields.edit-field-with-name':
    '编辑“{fieldLabel}”',
  'settings.customization.custom-fields.configure-desc': '配置字段属性',
  'settings.customization.custom-fields.actions': '操作',
  'settings.customization.custom-fields.actions-desc': '管理所有自定义字段',
  'settings.customization.custom-fields.add-button': '添加自定义字段',
  'settings.customization.custom-fields.delete-all-button': '删除所有字段',
  'settings.customization.custom-fields.editor.title': '字段配置',
  'settings.customization.custom-fields.editor.label': '字段标签',
  'settings.customization.custom-fields.editor.label-desc':
    '在交易表单中显示的名称',
  'settings.customization.custom-fields.editor.label-placeholder':
    '例如:交易质量',
  'settings.customization.custom-fields.editor.key': '前置元数据键',
  'settings.customization.custom-fields.editor.key-desc':
    '在笔记前置元数据中使用的键名(小写,下划线)',
  'settings.customization.custom-fields.editor.key-placeholder': 'field_name',
  'settings.customization.custom-fields.editor.key-reserved': '此键名为保留键',
  'settings.customization.custom-fields.editor.type': '字段类型',
  'settings.customization.custom-fields.editor.type-desc': '此字段的输入类型',
  'settings.customization.custom-fields.editor.placeholder': '占位提示文本',
  'settings.customization.custom-fields.editor.placeholder-desc':
    '字段为空时显示的提示文本',
  'settings.customization.custom-fields.editor.placeholder-input':
    '输入占位提示文本...',
  'settings.customization.custom-fields.editor.validation': '验证规则',
  'settings.customization.custom-fields.editor.validation-desc': '字段验证规则',
  'settings.customization.custom-fields.editor.validation.required': '必填',
  'settings.customization.custom-fields.editor.validation.required-desc':
    '字段必须有值',
  'settings.customization.custom-fields.editor.validation.min-length':
    '最小长度',
  'settings.customization.custom-fields.editor.validation.min-length-desc':
    '文本最小长度',
  'settings.customization.custom-fields.editor.validation.no-min': '无最小值',
  'settings.customization.custom-fields.editor.validation.max-length':
    '最大长度',
  'settings.customization.custom-fields.editor.validation.max-length-desc':
    '文本最大长度',
  'settings.customization.custom-fields.editor.validation.no-max': '无最大值',
  'settings.customization.custom-fields.editor.validation.min-value': '最小值',
  'settings.customization.custom-fields.editor.validation.min-value-desc':
    '数值最小值',
  'settings.customization.custom-fields.editor.validation.max-value': '最大值',
  'settings.customization.custom-fields.editor.validation.max-value-desc':
    '数值最大值',
  'settings.customization.custom-fields.editor.options': '选项',
  'settings.customization.custom-fields.editor.options-desc':
    '下拉选择/多选的可用选项',
  'settings.customization.custom-fields.editor.add-option': '添加新选项',
  'settings.customization.custom-fields.editor.add-option-desc':
    '向列表添加新选项',
  'settings.customization.custom-fields.editor.add-option-placeholder':
    '新选项值',
  'settings.customization.custom-fields.editor.allow-create': '允许创建新选项',
  'settings.customization.custom-fields.editor.allow-create-desc':
    '允许用户在填写表单时创建新选项',
  'settings.customization.custom-fields.editor.save': '保存字段',
  'settings.customization.custom-fields.editor.delete': '删除字段',

  'settings.customization.options.commission.costs': 'Costs',
  'settings.customization.options.commission.add-rule': '+ Add cost rule',
  'settings.customization.options.commission.applies-to': 'Applies to',
  'settings.customization.options.commission.method': 'Method',
  'settings.customization.options.commission.entry': 'Entry',
  'settings.customization.options.commission.exit': 'Exit',
  'settings.customization.options.commission.round-trip': 'Round trip',
  'settings.customization.options.commission.actions': 'Actions',
  'settings.customization.options.commission.all-accounts': 'All accounts',
  'settings.customization.options.commission.per-side': 'Per side',
  'settings.customization.options.commission.remove-rule': 'Remove cost rule',
  'settings.customization.custom-fields.editor.trade-log': 'Trade Log',
  'settings.customization.custom-fields.editor.trade-log-desc':
    'Control how this field appears when added as a Trade Log column',
  'settings.customization.custom-fields.editor.column-label':
    'Trade Log Column Label',
  'settings.customization.custom-fields.editor.column-label-desc':
    'Optional shorter label used only in the Trade Log header',
  'settings.customization.custom-fields.editor.column-label-placeholder':
    'Use field label by default',
  'settings.customization.custom-fields.editor.display-as-currency':
    '显示为货币',
  'settings.customization.custom-fields.editor.display-as-currency-desc':
    '仅在交易日志中将此数字字段格式化为货币值',
  'settings.customization.custom-fields.editor.dropdown-sort':
    'Dropdown Sort Mode',
  'settings.customization.custom-fields.editor.dropdown-sort-desc':
    'Disabled by default. Enable sorting only when this dropdown has a meaningful order.',
  'settings.customization.custom-fields.editor.dropdown-sort.disabled':
    'Disabled',
  'settings.customization.custom-fields.editor.dropdown-sort.alphabetical':
    'Alphabetical',
  'settings.customization.custom-fields.editor.dropdown-sort.numeric':
    'Numeric',
  'settings.customization.custom-fields.editor.dropdown-sort.option-order':
    'Configured option order',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display':
    'Collapsed Display',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display-desc':
    'Choose how multiselect values render when Trade Log expanded mode is off',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.count':
    'Count badge',
  'settings.customization.custom-fields.editor.multiselect-collapsed-display.values':
    'Value list',

  'settings.customization.custom-fields.type.text': '文本',
  'settings.customization.custom-fields.type.number': '数字',
  'settings.customization.custom-fields.type.date': '日期',
  'settings.customization.custom-fields.type.datetime': '日期时间',
  'settings.customization.custom-fields.type.time': '时间',
  'settings.customization.custom-fields.error.cannot-save':
    '无法保存字段:{error}',
  'settings.customization.custom-fields.error.duplicate-key':
    '已存在使用此前置元数据键的字段',
  'settings.customization.custom-fields.error.save-failed':
    '保存字段失败:{error}',
  'settings.customization.custom-fields.notice.import-summary':
    '已导入{totalCount}个字段,其中{validCount}个有效',
  'settings.customization.custom-fields.delete.confirm-message':
    '确定要删除自定义字段"{fieldLabel}"吗?',
  'settings.customization.custom-fields.delete.cannot-undo': '此操作无法撤销。',
  'settings.customization.custom-fields.reset.confirm-message':
    '确定要删除所有自定义字段吗?',
  'settings.customization.custom-fields.saved-options.title': '已保存的选项',
  'settings.customization.custom-fields.saved-options.description':
    '用户为此字段创建的选项',
  'settings.customization.custom-fields.saved-options.delete-error':
    '删除选项失败',
  'settings.customization.custom-fields.saved-options.clear-error':
    '清除选项失败',
  'settings.customization.custom-fields.option.delete-confirm':
    '确定要删除选项"{optionName}"吗?',
  'settings.customization.custom-fields.option.clear-confirm':
    '确定要删除"{fieldLabel}"的所有已保存选项吗?',

  
  
  

  

  'drc.tab.review': '交易复盘',

  

  

  'drc.missed-trades.label.reason': '原因:',

  

  
  
  

  'weekly.tab.review': '回顾',

  
  'weekly.review.drcs.title': '本周每日复盘',

  'weekly.review.performance.title': '表现自评',
  'weekly.review.performance.mental': '心态表现',

  'weekly.review.performance.technical': '技术执行',

  'weekly.review.questions.title': '周度回顾问题',

  'weekly.review.goals.title': '下周目标',

  
  'weekly.preparation.goals.title': '本周目标',

  'weekly.preparation.events.title': '重要事件',

  'weekly.preparation.events.add-button': '添加事件',

  'weekly.preparation.forecast.title': '周度预测',

  
  'weekly.overview.pnl-chart.title': '周度累计盈亏',

  'weekly.overview.drawdown-chart.title': '周度回撤',

  'weekly.overview.performance.title': '周度表现',

  'weekly.overview.setup-performance.title': '策略表现',

  'weekly.overview.trades-chart.title': '周度交易',

  'weekly.overview.best-trade.title': '本周最佳交易',

  'weekly.overview.worst-trade.title': '本周最差交易',

  'weekly.overview.daily-performance.title': '每日表现',

  'weekly.overview.button.create-trade': '创建交易',
  'weekly.overview.button.view-trade-details': '查看交易详情',

  
  
  
  'upgrade.title': '升级到专业版',
  'upgrade.feature-message':
    '{featureName} 是专业版功能。升级以解锁高级自动化和功能。',
  'upgrade.benefits-title': '专业版功能包括:',
  'upgrade.benefit.csv': '带 AI 列映射的 Trade Import',
  'upgrade.benefit.economic-calendar': '自动导入每周事件的经济日历',
  'upgrade.benefit.trade-sync': '受支持经纪商的 Trade Sync',
  'upgrade.benefit.multi-account': '多账户支持',
  'upgrade.prop-profiles.message-firms':
    'Journalit 已备好 {count} 家自营交易公司的规则，可直接预填到你的挑战中。',
  'upgrade.prop-profiles.message-firm':
    'Journalit 已备好每个 {firm} 挑战的规则，可直接预填。',
  'upgrade.prop-profiles.message':
    'Journalit 已准备好各家自营交易公司的规则，可直接填入你的挑战。',
  'upgrade.prop-profiles.message-updates':
    '将挑战关联到其机构公布的规则，机构更改规则时 Journalit 会提醒你。',
  'upgrade.prop-profiles.message-updates-firm':
    '将挑战关联到 {firm} 公布的规则，{firm} 更改规则时 Journalit 会提醒你。',
  'upgrade.prop-profiles.benefits-title': 'Pro 帮你填好：',
  'upgrade.benefit.prop.rules': '回撤与每日亏损上限，直接取自你所在公司的规则',
  'upgrade.benefit.prop.payout': '出金门槛与资格条件',
  'upgrade.benefit.prop.phases': '所选挑战的阶段目标与进度',
  'upgrade.benefit.prop.updates': '公司修改规则时自动更新',
  'upgrade.trial-notice':
    '获取 2 周免费试用,可导入全部历史交易并无风险体验所有专业版功能。',

  
  
  

  'monthly.tab.review': '回顾',

  

  

  'monthly.overview.drawdown': '月度回撤',
  'monthly.overview.no-drawdown-data': '暂无回撤数据',

  

  
  
  
  'library.type.drc': 'DRC',
  'library.type.weekly': '周度复盘',
  'library.type.monthly': '月度复盘',
  'library.type.quarterly': '季度复盘',
  'library.type.yearly': '年度复盘',
  'library.type.trade': '交易',
  'library.error.invalid-share-code': '分享码无效',
  'library.notice.import-success': '布局"{name}"导入成功!',
  'library.error.import-failed': '导入布局失败',
  'library.notice.select-template': '请选择要导出的布局',
  'library.notice.template-not-found': '未找到布局',
  'library.notice.code-generated': '分享码已生成!',
  'library.error.export-failed': '导出布局失败',
  'library.error.export-too-large': '此布局过大，无法导出为分享码。',
  'library.notice.copied': '分享码已复制到剪贴板!',
  'library.error.copy-failed': '复制到剪贴板失败',
  'library.title.import': '导入布局',
  'library.desc.import': '粘贴 JRT 分享码以导入其他用户的布局。',
  'library.label.share-code': '分享码',
  'library.placeholder.import-code': '在此粘贴 JRT-... 分享码',
  'library.button.validating': '验证中...',
  'library.button.validate': '验证',
  'library.button.import': '导入布局',
  'library.preview.valid': '布局有效',
  'library.preview.invalid': '分享码无效',
  'library.title.export': '导出布局',
  'library.desc.export': '选择布局生成分享码供他人导入。',
  'library.empty.title': '没有可导出的自定义布局。',
  'library.empty.hint':
    '请先在复盘或交易模板标签页创建自定义模板,然后返回此处分享。',
  'library.label.select-template': '选择布局',
  'library.option.select-template': '-- 选择布局 --',
  'library.button.generate-code': '生成分享码',
  'library.button.copy-code': '复制到剪贴板',

  
  
  
  'image.uploader.paste-title': '从剪贴板粘贴媒体(Ctrl+V)',
  'image.uploader.pasting': '粘贴中...',
  'image.uploader.paste': '粘贴',
  'image.uploader.url-placeholder': '粘贴媒体 URL 或文件路径...',
  'image.uploader.url-input-aria': '媒体URL输入框',
  'image.uploader.file-upload-aria': '从文件上传',
  'image.uploader.paste-clipboard-aria': '从剪贴板粘贴',
  'image.uploader.error-invalid-url':
    '图片 URL 或文件路径无效。请输入支持的图片 URL、仓库图片路径或 Excalidraw 链接。',

  
  
  
  'image.viewer.alt-default': '图片',
  'image.viewer.description-default': '媒体预览',

  'image.viewer.title-fullscreen': '点击查看全屏',

  'image.viewer.delete-button': '删除图片',
  'image.viewer.nav-prev': '上一张图片',
  'image.viewer.nav-next': '下一张图片',
  'image.viewer.zoom-in-hint': '捏合或点击以放大',
  'image.viewer.zoom-out-hint': '{scale}x(捏合或点击以缩小)',

  'image.viewer.close-aria': '关闭全屏',
  'image.viewer.copy-image': '复制图片',

  'image.viewer.copied': '已复制',
  'image.viewer.copy-failed': '无法将图片复制到剪贴板',
  'image.viewer.copy-unsupported': '当前环境不支持复制图片到剪贴板',

  
  
  
  'media.viewer.video-controls': '视频控件',
  'media.viewer.play-video': '播放视频',
  'media.viewer.pause-video': '暂停视频',
  'media.viewer.mute-video': '静音视频',
  'media.viewer.unmute-video': '取消视频静音',
  'media.viewer.volume': '音量',
  'media.viewer.back-5': '后退 5 秒',
  'media.viewer.forward-5': '前进 5 秒',
  'media.viewer.timeline': '视频时间轴',

  'image.carousel.no-images': '暂无可显示的图片',
  'image.carousel.prev': '上一张图片',
  'image.carousel.next': '下一张图片',
  'image.carousel.image-alt': '{prefix} {index}',
  'image.carousel.thumbnail-alt': '缩略图 {index}',

  
  
  
  'paste.notice.image-pasted': '📋 图片粘贴成功',
  'paste.notice.images-pasted': '📋 已成功粘贴 {count} 张图片',
  'paste.error.clipboard-not-supported': '不支持剪贴板 API',
  'paste.error.clipboard-empty': '剪贴板中没有可粘贴的内容',
  'paste.error.file-size-exceeds': '文件大小 {size}MB 超出限制',
  'paste.error.no-images-found': '剪贴板中未找到图片。请先复制图片。',
  'paste.error.permission-denied': '权限被拒绝',

  
  
  
  'manual-drawdown.notice.deleted': '快照已删除',
  'manual-drawdown.notice.updated': '快照已更新',
  'manual-drawdown.notice.added': '快照已添加',
  'manual-drawdown.validation.date-required': '日期为必填项',
  'manual-drawdown.validation.invalid-date': '请输入有效日期',
  'manual-drawdown.validation.future-date': '日期不能是未来日期',
  'manual-drawdown.validation.limit-required': '回撤限额为必填项',
  'manual-drawdown.validation.limit-positive': '回撤限额必须为正数',
  'manual-drawdown.validation.duplicate-date':
    '该日期已存在快照。请选择其他日期或编辑现有快照。',
  'manual-drawdown.section.recorded': '已记录的快照',
  'manual-drawdown.table.date': '日期',
  'manual-drawdown.table.limit': '回撤限额',
  'manual-drawdown.table.note': '备注',
  'manual-drawdown.table.actions': '操作',
  'manual-drawdown.button.editing': '编辑中',
  'manual-drawdown.button.edit': '编辑',
  'manual-drawdown.button.delete': '删除',
  'manual-drawdown.header.edit': '编辑快照',
  'manual-drawdown.header.add': '添加新快照',
  'manual-drawdown.field.date': '回撤日期 *',
  'manual-drawdown.field.date-desc': '券商设置该限额的日期',
  'manual-drawdown.field.limit': '最低余额($)*',
  'manual-drawdown.field.limit-desc': '允许的最低余额',
  'manual-drawdown.field.note': '备注(可选)',
  'manual-drawdown.field.note-desc': '关于该快照的补充说明',
  'manual-drawdown.placeholder.note': '例如:月末对账单',
  'manual-drawdown.button.update': '更新快照',
  'manual-drawdown.button.add': '添加快照',
  'manual-drawdown.button.cancel-edit': '取消编辑',
  'manual-drawdown.modal.delete-title': '删除快照?',
  'manual-drawdown.modal.delete-confirm': '删除 {date} 的回撤快照?',
  'manual-drawdown.modal.delete-limit': '回撤限额:{limit}',
  'manual-drawdown.modal.delete-warning': '此操作无法撤销。',

  
  
  

  
  
  

  
  
  
  'combobox.placeholder.default': '选择或输入...',
  'combobox.aria.remove-item': '移除 {item}',
  'combobox.add-option': '添加"{value}"',

  
  
  

  
  
  
  'release-notes.title': '更新日志',
  'release-notes.loading-plugin': '正在加载插件...',

  'release-notes.no-content': '未找到更新日志',
  'release-notes.current-version': '当前:v{version}',
  'release-notes.version': '版本 {version}',
  'release-notes.link.docs': '文档',
  'release-notes.link.discord': 'Discord',
  'release-notes.link.github': 'GitHub',

  
  
  
  'skeleton.tradelog.loading': '正在加载交易数据',
  'skeleton.dashboard-widget.loading': '正在加载小组件数据',
  'skeleton.account-page.loading': '正在加载账户页面',

  'grid.aria.remove-widget': '移除小组件',

  
  
  

  
  
  
  'onboarding.welcome.title': '欢迎使用 Journalit',
  'onboarding.welcome.subtitle': '一个存放在您设备上的交易日志。',
  'onboarding.welcome.cta': '设置我的日志',
  'onboarding.welcome.chart.week': '第 {count} 周',
  'onboarding.view.title': 'Journalit 引导',
  'onboarding.wizard.skip-aria': '跳过此步骤',
  'onboarding.wizard.skip-onboarding': '跳过引导',

  'onboarding.common.continue': '继续',
  'onboarding.common.close': '关闭',

  'onboarding.features.badge.pro': 'PRO',

  
  
  

  
  
  

  'onboarding.features.graphic.syncing': '同步交易中...',
  'onboarding.features.graphic.complete': '同步完成',
  'onboarding.features.graphic.direction.long': '做多',
  'onboarding.features.graphic.direction.short': '做空',
  'onboarding.features.graphic.status.win': '盈利',
  'onboarding.features.graphic.status.loss': '亏损',

  'onboarding.activation.title': '登录 Journalit',

  'onboarding.activation.status.initializing': '正在生成你的认证码...',

  'onboarding.activation.status.error': '登录失败',
  'onboarding.activation.error.init': '无法开始登录。请检查网络后重试。',
  'onboarding.activation.error.denied': '登录被拒绝。你可以稍后在设置中登录。',
  'onboarding.activation.error.expired': '代码已过期。请重新开始引导流程再试。',
  'onboarding.activation.error.generic': '出现问题。请重试。',
  'onboarding.activation.error.save': '登录成功但保存失败。请重启插件后重试。',
  'onboarding.activation.error.connection': '连接中断。请检查网络后重试。',
  'onboarding.activation.notice.invalid-url': '激活链接无效。请联系支持。',

  'onboarding.activation.notice.popup-blocked-manual':
    '请在浏览器中打开此链接:{url}',
  'onboarding.activation.notice.copy-code-failed': '无法复制代码,请手动复制。',
  'onboarding.activation.label.code': '你的认证码',
  'onboarding.activation.button.copy': '复制代码',
  'onboarding.activation.button.copied': '已复制!',
  'onboarding.activation.step.open-browser': '点击下方打开浏览器',
  'onboarding.activation.step.enter-code': '输入你的认证码',
  'onboarding.activation.step.complete-signin': '完成登录',
  'onboarding.activation.step.return-here': '返回此处以自动完成',
  'onboarding.activation.button.open-browser': '打开浏览器登录',
  'onboarding.activation.waiting.title': '等待登录...',
  'onboarding.activation.waiting.hint': '通常不到一分钟',
  'onboarding.activation.success.title': '登录完成!',

  'onboarding.notice.complete-failed': '无法保存新手引导完成状态。请稍后再试。',
  'onboarding.notice.completed': '您的日志已设置完成。新手引导已完成。',
  'onboarding.familiarity.kicker': '快速提问',
  'onboarding.familiarity.title': '您以前用过 Obsidian 吗？',
  'onboarding.familiarity.subtitle':
    'Journalit 运行在 Obsidian 内。如果您是新手，我们只展示必要的内容。',
  'onboarding.familiarity.option.yes.label': '用过，我很熟悉',
  'onboarding.familiarity.option.yes.description': '跳过入门介绍。',
  'onboarding.familiarity.option.no.label': '没有，我是 Obsidian 新手',
  'onboarding.familiarity.option.no.description':
    '仅一个简短页面，无引导游览。',
  'onboarding.orientation.kicker': 'Obsidian 新手',
  'onboarding.orientation.title': '需要了解的四件事',
  'onboarding.orientation.subtitle': '了解这些就足以使用 Journalit。',
  'onboarding.orientation.inside.title': 'Journalit 运行在 Obsidian 内',
  'onboarding.orientation.inside.body':
    '无需先学习 Obsidian。当前页面就是一个 Journalit 视图。',
  'onboarding.orientation.sidebar.title': '侧边栏用于导航',
  'onboarding.orientation.sidebar.body':
    '首页、仪表板、交易日志和复盘都在那里。',
  'onboarding.orientation.sidebar.action': '显示侧边栏',
  'onboarding.orientation.sidebar.action-mobile': '打开侧边栏',
  'onboarding.orientation.sidebar.hint': '就在左侧。此页面保持打开。',
  'onboarding.orientation.sidebar.hint-mobile':
    '它会覆盖在此页面上。滑动或点击外部即可返回。',
  'onboarding.orientation.tabs.title': '视图以标签页打开',
  'onboarding.orientation.tabs.body': '就像这个一样。在顶部切换。',
  'onboarding.orientation.privacy.title': '您的日志保存在您的设备上',
  'onboarding.orientation.privacy.body':
    '笔记、截图和复盘都是您自己的文件。只有导入或同步的交易会经过 Journalit 服务器。',
  'onboarding.orientation.continue': '明白了',
  'onboarding.data-source.kicker': '您的交易',
  'onboarding.data-source.title': '您的交易现在在哪里？',
  'onboarding.data-source.subtitle':
    '您的历史记录是您优势的一部分。带上它，统计数据从第一天起就有意义，而不必等待数月积累新交易。',
  'onboarding.data-source.option.broker.label': '在我的券商或平台上',
  'onboarding.data-source.option.broker.description':
    '连接它，或导入其导出文件。',
  'onboarding.data-source.option.file.label': '在我自己的表格里',
  'onboarding.data-source.option.file.description':
    '你在 Excel、Google 表格或 CSV 中记录的交易日志。',
  'onboarding.data-source.option.fresh.label': '还没有，我从零开始',
  'onboarding.data-source.option.fresh.description': '边交易边记录。',
  'onboarding.data-source.option.sample.label': '还没有，先看看示例',
  'onboarding.data-source.option.sample.description':
    '在添加自己的交易之前，先浏览一个现成的日志。',
  'onboarding.broker.kicker': '您的券商',
  'onboarding.broker.title': '哪家券商或平台？',
  'onboarding.awaiting.sign-in.action': '登录以继续',
  'onboarding.awaiting.sign-in.body':
    '请先登录或创建免费的 Journalit 账户。之后您的交易就会进入日志。',
  'onboarding.broker.badge.sync': '自动同步',
  'onboarding.broker.search': '搜索券商和平台',
  'onboarding.broker.subtitle': '我们会选择最佳方式导入您的交易。',
  'onboarding.broker.option.unlisted.label': '不在列表中',
  'onboarding.broker.option.metatrader4.label': 'MetaTrader 4',
  'onboarding.broker.option.metatrader5.label': 'MetaTrader 5',
  'onboarding.broker.request.title': '还没有列出？告诉我们你的券商',
  'onboarding.broker.request.body':
    '新券商按需求添加。告诉我们是哪家（附导出样本更好）；在此之前可手动映射导出文件。',
  'onboarding.broker.request.discord': '在 Discord 上申请',
  'onboarding.broker.request.continue': '继续手动导入',
  'onboarding.broker.loading': '正在检查支持的券商...',
  'onboarding.broker.offline':
    '无法加载完整列表。您仍可连接受支持的券商或导入文件。',
  'onboarding.personalise.kicker': '设置您的日志',
  'onboarding.personalise.title': '几个快速选择',
  'onboarding.personalise.subtitle': '我们会根据您的回答个性化 Journalit。',
  'onboarding.personalise.style.question': '您如何交易？',
  'onboarding.personalise.style.scalping': '每天很多笔交易',
  'onboarding.personalise.style.intraday': '每天几笔，不隔夜',
  'onboarding.personalise.style.swing': '持仓数天或数周',
  'onboarding.personalise.style.position': '持仓数周或数月',
  'onboarding.personalise.account.question': '什么类型的账户？',
  'onboarding.personalise.account.personal': '个人',
  'onboarding.personalise.account.practice': '模拟或练习',
  'onboarding.personalise.account.prop': '自营公司挑战或已获资金',
  'onboarding.personalise.asset.question': '您主要交易什么？',
  'onboarding.personalise.asset.stock': '股票',
  'onboarding.personalise.asset.futures': '期货',
  'onboarding.personalise.asset.forex': '外汇',
  'onboarding.personalise.asset.crypto': '加密货币',
  'onboarding.personalise.asset.options': '期权',
  'onboarding.personalise.asset.mixed': '混合',
  'onboarding.first-trade.kicker': '即将完成',
  'onboarding.first-trade.title': '添加您的第一笔交易',
  'onboarding.first-trade.subtitle':
    '您的日志已就绪。记录一笔交易，Journalit 就会开始工作。',
  'onboarding.first-trade.cta': '添加我的第一笔交易',
  'onboarding.first-trade.sample': '用示例数据探索',
  'onboarding.preparing-sample.title': '正在准备示例日志',
  'onboarding.preparing-sample.body':
    '只需几秒钟。写入笔记期间 Obsidian 可能略有卡顿。',
  'onboarding.preparing-sample.starting': '正在开始…',
  'onboarding.preparing-sample.hint': '随时可以通过角落的标记移除示例日志。',
  'onboarding.preparing-sample.failed.title': '无法创建示例日志',
  'onboarding.preparing-sample.failed.body': '可以重试，或选择其他方式开始。',
  'onboarding.preparing-sample.retry': '重试',
  'onboarding.sample-exploring.kicker': '示例日志',
  'onboarding.sample-exploring.title': '你正在浏览示例日志',
  'onboarding.sample-exploring.body':
    '慢慢来。退出示例后，我们会从这里继续：个性化你自己的日志并添加第一笔交易。',
  'onboarding.sample-exploring.exit': '退出示例并继续',
  'onboarding.sample-exploring.failed.title': '无法恢复示例日志',
  'onboarding.sample-exploring.failed.body':
    '退出示例以清除残留内容，然后继续设置你自己的日志。',
  'onboarding.awaiting.kicker': '等待您的第一批交易',
  'onboarding.awaiting.first-sync.title': '完成券商连接',
  'onboarding.awaiting.first-sync.body':
    '请在设置 > Trade Sync 中完成连接。第一批交易同步后，此设置页面会自动关闭。',
  'onboarding.awaiting.first-sync.action': '打开 Trade Sync',
  'onboarding.awaiting.first-import.title': '导入您的文件',
  'onboarding.awaiting.first-import.body':
    '请在 Trade Import 标签页中完成导入。第一批交易导入后，此设置页面会自动关闭。',
  'onboarding.awaiting.first-import.action': '打开 Trade Import',
  'onboarding.awaiting.first-trade.title': '保存您的第一笔交易',
  'onboarding.awaiting.first-trade.body':
    '第一笔交易保存后，此设置页面会自动关闭。',
  'onboarding.awaiting.first-trade.action': '添加交易',
  'onboarding.awaiting.change-route': '选择其他方式',
  'onboarding.notice.personalise-failed':
    '无法应用您的设置选择。您可以稍后在设置中调整。',
  'onboarding.notice.trade-sync-open-failed': '无法打开 Trade Sync。请重试。',
  'onboarding.notice.skip-failed': '无法保存跳过新手引导。请稍后再试。',

  
  'csv.broker.tradingtechnologies': 'Trading Technologies (TT)',
  'csv.broker-guide.tradingtechnologies.description': 'Fills 小组件 CSV 导出',
  'csv.broker-guide.tradingtechnologies.step-1':
    '在 TT 中打开 Fills 小组件,并切换到 Detail、Continuous 或 Price with Detail 视图',

  'csv.broker-guide.tradingtechnologies.warning.emphasis': '重要:',

  'trade.metadata.broker-comment': '经纪商备注',

  
  'navigation.title': 'Journalit',
  'calendar.sidebar.title': '绩效日历',
  'navigation.section.overview': '概览',
  'navigation.section.reviews': '回顾',
  'navigation.section.tools': '工具',
  'navigation.edit-mode.toggle': '自定义导航',
  'navigation.edit-mode.hide-item': '隐藏导航项',
  'navigation.edit-mode.restore-section': '已隐藏项目',
  'navigation.edit-mode.restore': '恢复',
  'navigation.items.nav-settings': '设置',
  'navigation.shortcuts.add': '添加快捷方式',
  'navigation.shortcuts.remove': '移除快捷方式',
  'navigation.shortcuts.close': '关闭快捷方式选择器',
  'navigation.shortcuts.search': '搜索账户和交易策略',
  'navigation.shortcuts.accounts': '账户',
  'navigation.shortcuts.setups': '交易策略',
  'navigation.shortcuts.empty': '没有可用的账户或交易策略',
  'navigation.shortcuts.unavailable': '不可用',
  'navigation.shortcuts.added': '已添加',
  'navigation.shortcuts.parent-required':
    '隐藏此导航项目前，请先移除其快捷方式。',
  'navigation.items.nav-home': '首页',
  'navigation.items.nav-dashboard': '仪表盘',
  'navigation.items.nav-trade-log': '交易日志',
  'navigation.items.nav-account-dashboard': '账户',
  'navigation.items.nav-drc': '今日DRC',
  'navigation.items.nav-weekly': '本周回顾',
  'navigation.items.nav-monthly': '本月回顾',
  'navigation.items.nav-quarterly': '本季度回顾',
  'navigation.items.nav-yearly': '本年度回顾',
  'navigation.items.nav-add-trade': '添加交易',
  'navigation.items.nav-layout-builder': '布局构建器',
  'navigation.items.nav-quick-import': 'Quick Import',
  'navigation.items.nav-csv-import': 'Trade Import',
  'navigation.items.nav-session-mode': '会话模式',
  'navigation.items.nav-economic-calendar': '财经日历',
  'navigation.items.nav-position-size': '仓位大小计算器',
  'settings.general.navigation-sidebar': '导航侧栏',
  'notice.error.open-navigation-sidebar': '无法打开导航侧栏。请重试。',
  'navigation.setting.open': '打开导航侧栏',
  'navigation.setting.open.desc':
    '立即显示；如果 Obsidian 侧栏已折叠，则将其展开。',
  'navigation.setting.open.button': '打开侧栏',
  'calendar.setting.open': '打开日历',
  'calendar.setting.open.button': '打开日历',
  'notice.error.open-calendar-sidebar': '无法打开日历。请重试。',
  'navigation.setting.tab-behavior': '导航标签页行为',
  'navigation.setting.tab-behavior.desc':
    '在 Journalit 侧栏中点击时如何打开视图和复盘',
  'navigation.setting.tab-behavior.new-tab': '在新标签页中打开',
  'navigation.setting.tab-behavior.replace': '替换当前标签页',
  'navigation.search.placeholder': '搜索交易和回顾...',
  'navigation.search.clear': '清除搜索',
  'navigation.search.section.trades': '交易',
  'navigation.search.section.reviews': '回顾',
  'navigation.search.empty': '未找到结果',
  'navigation.search.trade-open': '持仓中',

  'command.open-navigation-sidebar': '打开导航侧栏',
  'command.open-calendar-sidebar': '打开日历侧栏',
  'command.open-economic-calendar': '打开财经日历',

  'widget.directional-drawdown.name': 'Directional Realized Drawdown',
  'widget.directional-drawdown.description':
    'Separate long and short closed-trade drawdown amount curves',

  'widget.long-drawdown.name': 'Long Drawdown',
  'widget.long-drawdown.description':
    'Closed-trade drawdown amount curve for long trades only',
  'widget.short-drawdown.name': 'Short Drawdown',
  'widget.short-drawdown.description':
    'Closed-trade drawdown amount curve for short trades only',
  'widget.directional-drawdown.title.long': 'Long Drawdown',
  'widget.directional-drawdown.title.short': 'Short Drawdown',
  'widget.directional-drawdown.empty.not-enough':
    'Not enough closed trades for directional analysis',
  'widget.directional-drawdown.empty.no-closed':
    'No closed directional trades for this period',
  'widget.directional-drawdown.empty.no-long':
    'No long closed trades for this period',
  'widget.directional-drawdown.empty.no-short':
    'No short closed trades for this period',
  'widget.directionalDrawdownChart.name': 'Directional Realized Drawdown',

  'widget.longDrawdownChart.name': 'Long Drawdown',
  'widget.longDrawdownChart.description': '仅做多交易的回撤',

  'widget.shortDrawdownChart.name': 'Short Drawdown',
  'widget.shortDrawdownChart.description': '仅做空交易的回撤',

  'widget.drawdownStats.no-conversion':
    'Drawdown stats are unavailable for mixed currencies without FX conversion.',

  'guide.skip-guide': '跳过引导',
  'guide.step-count': '{count} 个步骤',
  'guide.step-position': '第 {current} 步，共 {total} 步',
  

  'onboarding.activation.button.copy-link': '复制链接',

  'widget.previous-trading-day-context.name': 'Previous Trading Day Context',
  'widget.previous-trading-day-context.description':
    'Read-only context pulled from headings in the previous DRC',
  'widget.previous-trading-day-context.reference-label': 'Previous DRC',
  'widget.previous-trading-day-context.open-source': 'Open',
  'widget.previous-trading-day-context.image-alt-prefix': 'Previous DRC image',
  'widget.previous-trading-day-context.no-sections-configured':
    'Choose at least one section in the template settings.',
  'widget.previous-trading-day-context.preview-note':
    'Yesterday price swept liquidity, rejected from the weekly level, and closed back inside the planned range.',
  'widget.previous-trading-day-context.preview-bullet-two':
    'Main deviation: entered before confirmation on the first pullback.',
  'widget.previous-trading-day-context.preview-source':
    'Preview: previous DRC from the prior trading day',
  'widget.previous-trading-day-context.preview-bullet-one':
    'Daily bias matched the plan after the opening drive.',
  'widget.weekly-drc-context.name': 'Daily Reviews by Weekday',
  'widget.weekly-drc-context.description':
    'Show selected DRC sections for each day in the weekly review',

  'widget.weekly-drc-context.image-alt-prefix': 'Weekly DRC image',
  'widget.weekly-drc-context.no-activity': 'No activity for this day.',
  'widget.weekly-drc-context.no-sections-configured':
    'Choose at least one DRC section in the template settings.',
  'widget.weekly-drc-context.current-week-not-found':
    'Current weekly review not found.',
  'widget.weekly-drc-context.current-week-date-not-found':
    'Current weekly review date not found.',
  'widget.weekly-drc-context.load-error': 'Failed to load weekly DRC review.',
  'widget.weekly-drc-context.invalid-context': '此组件仅在周度复盘笔记中可用',
  'templateEditor.widget.weekly-drc-day-label': '日期',

  'templateEditor.widget.weekly-drc-start-collapsed': '默认折叠',
  'templateEditor.widget.weekly-drc-day-all': 'All days',

  'templateEditor.widget.previous-context-sections-label':
    'Sections to include',
  'templateEditor.widget.previous-context-heading-label':
    'Previous DRC section heading',
  'templateEditor.widget.previous-context-heading-placeholder':
    'Choose a heading',
  'templateEditor.widget.review-context-fields.selection': 'Fields to display',
  'templateEditor.widget.review-context-fields.selection.all': 'All fields',
  'templateEditor.widget.review-context-fields.selection.group': 'Field group',
  'templateEditor.widget.review-context-fields.selection.fields':
    'Specific fields',
  'templateEditor.widget.review-context-fields.group': 'Group',
  'templateEditor.widget.review-context-fields.group-placeholder':
    'Select group',
  'templateEditor.widget.review-context-fields.fields': 'Fields',
  'templateEditor.widget.review-context-fields.fields-placeholder':
    'Select fields',
  'templateEditor.widget.review-context-fields.fields-selected':
    '{count} fields selected',
  'templateEditor.widget.review-context-fields.no-fields':
    'Create review fields in Settings first.',

  'templateEditor.widget.review-context-fields.context': 'Context',
  'templateEditor.widget.review-context-fields.context.both': 'Both',
  'templateEditor.widget.review-context-fields.inherited': 'Inherited',
  'templateEditor.widget.review-context-fields.current': 'Current',
  'templateEditor.widget.review-context-fields.empty-values': 'Empty values',
  'templateEditor.widget.review-context-fields.hide-empty': 'Hide empty values',
  'templateEditor.widget.trade-review.primary-metrics': '主要指标',
  'templateEditor.widget.trade-review.classification': '分类',
  'templateEditor.widget.trade-review.more-context': '更多上下文',
  'templateEditor.widget.trade-review.display': '显示',
  'templateEditor.widget.trade-review.show-images': '显示图片',
  'templateEditor.widget.trade-review.fields-none': '无字段',
  'templateEditor.widget.trade-review.fields-all': '所有字段',
  'templateEditor.widget.trade-review.fields-count': '{count} 个字段',
  'templateEditor.widget.trade-review.no-fields': '没有可用字段',
  'templateEditor.widget.trade-review.questions': '复盘问题',
  'templateEditor.widget.trade-review.questions-help':
    '选择每种交易结果要显示的问题。问题 ID 保持不变，因此编辑或重新排序问题后，已保存的答案仍会保持关联。',
  'templateEditor.widget.trade-review.outcome.win': '盈利',
  'templateEditor.widget.trade-review.outcome.loss': '亏损',
  'templateEditor.widget.trade-review.outcome.breakeven': '保本',
  'templateEditor.widget.trade-review.outcome.open': '持仓中',
  'templateEditor.widget.trade-review.questions-empty': '此结果没有问题。',
  'templateEditor.widget.trade-review.question-label': '问题',
  'templateEditor.widget.trade-review.question-placeholder': '输入复盘问题',
  'templateEditor.widget.trade-review.answer-placeholder-label': '回答提示',
  'templateEditor.widget.trade-review.answer-placeholder':
    '显示在回答字段中的可选提示',
  'templateEditor.widget.trade-review.add-question': '+ 添加问题',
  'templateEditor.widget.trade-review.answer-type-label': '回答类型',
  'templateEditor.widget.trade-review.answer-type-text': '文本',
  'templateEditor.widget.trade-review.answer-type-choice': '选择',
  'templateEditor.widget.trade-review.option-placeholder': '选项标签',
  'templateEditor.widget.trade-review.add-option': '+ 添加选项',
  'templateEditor.widget.trade-review.condition-label': '显示条件',
  'templateEditor.widget.trade-review.condition-always': '始终显示',
  'templateEditor.widget.trade-review.condition-option-label':
    '当问题 {questionNumber} = {option}',
  'templateEditor.widget.previous-context-add-section': '+ Add section',

  'templateEditor.widget.previous-context-fallback-label':
    'Previous DRC fallback',
  'templateEditor.widget.previous-context-fallback-nearest':
    'Nearest earlier DRC',
  'templateEditor.widget.previous-context-fallback-expected':
    'Expected previous trading day only',
  'widget.stats.vs-prev': 'vs prev',
  'common.r-missing.title': '此交易没有 R',
  'common.r-missing.trade': '此交易没有风险金额，因此无法以 R 显示其结果。',
  'common.r-missing.fix': '请添加风险金额，或在设置中设定默认风险金额。',
  'common.r-coverage.partial':
    '基于 {total} 笔交易中的 {valid} 笔。没有风险金额的交易不计入 R。',
  'common.r-coverage.none':
    '这里没有任何交易设有风险金额，因此没有可显示的 R。',
  'dashboard.r-coverage.no-comparison': '未显示变化：对比期间此指标没有 R 值。',
  'dashboard.metrics.past-30d': 'past 30d',

  'settings.customization.trade-fields': 'Custom Trade Fields',
  'settings.customization.review-fields': 'Custom Review Fields',
  'settings.customization.review-fields.description':
    'Create custom fields for review notes. These fields are stored under reviewCustomFields and can later be inherited across monthly, weekly, and daily reviews.',
  'settings.customization.review-fields.title': 'Review Fields ({count})',
  'settings.customization.review-fields.manage-desc':
    'Manage custom fields for review notes',
  'settings.customization.review-fields.no-fields':
    'No custom review fields defined yet',
  'settings.customization.review-fields.no-fields-desc':
    'Review fields will be used by review-note widgets and will not appear in the trade form or Trade Log.',
  'settings.customization.review-fields.add-button': 'Add Review Field',
  'settings.customization.review-fields.delete-all-button':
    'Delete All Review Fields',
  'settings.customization.review-fields.add-new': 'Add New Review Field',
  'settings.customization.review-fields.edit-field-with-name':
    'Edit “{fieldLabel}”',
  'settings.customization.review-fields.configure-desc':
    'Configure your review field settings below',
  'settings.customization.review-fields.actions-desc':
    'Manage your custom review fields',
  'settings.customization.review-fields.default-label': 'New Review Field',
  'settings.customization.review-fields.unknown-field': 'Unknown Review Field',
  'settings.customization.review-fields.field-summary':
    'Type: {type} • Reviews: {reviews}',
  'settings.customization.review-fields.error.save-failed':
    'Failed to save review field. Please try again.',
  'settings.customization.review-fields.delete.confirm-message':
    'Are you sure you want to delete the custom review field "{fieldLabel}"?',
  'settings.customization.review-fields.reset.confirm-message':
    'Are you sure you want to delete ALL custom review fields?',
  'settings.customization.review-fields.editor.title':
    'Review Field Configuration',
  'settings.customization.review-fields.editor.label-desc':
    'Display name for this review field',
  'settings.customization.review-fields.editor.label-placeholder':
    'Enter review field label',
  'settings.customization.review-fields.editor.key': 'Review Field Key',
  'settings.customization.review-fields.editor.key-desc':
    'This key will be stored inside review note frontmatter at',
  'settings.customization.review-fields.editor.type-desc':
    'Type of review field input',
  'settings.customization.review-fields.editor.description': 'Description',
  'settings.customization.review-fields.editor.description-desc':
    'Optional help text for this review field',
  'settings.customization.review-fields.editor.description-placeholder':
    'Explain how this field should be used',
  'settings.customization.review-fields.editor.placeholder-desc':
    'Optional placeholder text shown when entering a local review value',
  'settings.customization.review-fields.editor.placeholder-input':
    'Enter review field placeholder',

  'settings.customization.review-fields.editor.group': 'Field Group',
  'settings.customization.review-fields.editor.group-desc':
    'Choose the review field group this field belongs to.',
  'settings.customization.review-fields.groups.add-button': 'Add Group',
  'settings.customization.review-fields.groups.default-name': 'New Group',
  'settings.customization.review-fields.groups.untitled': 'Untitled Group',
  'settings.customization.review-fields.groups.ungrouped': 'Ungrouped',
  'settings.customization.review-fields.groups.field-count': '{count} fields',
  'settings.customization.review-fields.groups.empty':
    'No fields in this group yet.',
  'settings.customization.review-fields.groups.rename-prompt': 'Group name',
  'settings.customization.review-fields.groups.delete-message':
    'Delete the review field group "{groupName}"?',
  'settings.customization.review-fields.groups.delete-note':
    'Fields in this group will become ungrouped. Their saved review values are not deleted.',
  'settings.customization.review-fields.groups.error.duplicate':
    'A review field group with this name already exists.',
  'settings.customization.review-fields.groups.error.save-failed':
    'Failed to save review field group.',
  'settings.customization.review-fields.editor.compact': 'Compact Display',
  'settings.customization.review-fields.editor.compact-desc':
    'Prefer compact rendering when this field appears in review widgets',
  'settings.customization.review-fields.editor.appears-on': 'Appears On',
  'settings.customization.review-fields.editor.appears-on-desc':
    'Review note types that can show this field',
  'settings.customization.review-fields.editor.editable-on': 'Editable On',
  'settings.customization.review-fields.editor.editable-on-desc':
    'Review note types where users can enter a local value',
  'settings.customization.review-fields.editor.inherit-to': 'Inherited Into',
  'settings.customization.review-fields.editor.inherit-to-desc':
    'Lower review note types that can display inherited values from this field',
  'settings.customization.review-fields.editor.inheritance':
    'Enable Inheritance',
  'settings.customization.review-fields.editor.inheritance-desc':
    'Allow this field to be read from higher-timeframe review notes',
  'settings.customization.review-fields.editor.inheritance-mode':
    'Inheritance Mode',
  'settings.customization.review-fields.editor.inheritance-mode-desc':
    'Controls whether child reviews show inherited values, local values, or both',
  'settings.customization.review-fields.editor.sources': 'Inheritance Sources',
  'settings.customization.review-fields.editor.sources-desc':
    'Higher-timeframe review types this field can inherit from',

  'settings.customization.review-fields.editor.options-desc':
    'Available choices for this review field',
  'settings.customization.review-fields.editor.allow-create-desc':
    'Users can create new options when using this field in review notes',
  'settings.customization.review-fields.editor.save': 'Save Review Field',
  'settings.customization.review-fields.editor.delete': 'Delete Review Field',
  'settings.customization.review-fields.inheritance-mode.inherit-only':
    'Inherited only',
  'settings.customization.review-fields.inheritance-mode.local-only':
    'Local only',
  'settings.customization.review-fields.inheritance-mode.inherit-and-local':
    'Inherited and local',

  'calendar.aria.open-daily-review': '打开 {date} 的每日复盘',
  'calendar.aria.open-weekly-review': '打开 {date} 的每周复盘',
  'calendar.aria.open-monthly-review': '打开 {date} 的月度复盘',
  'calendar.aria.open-quarterly-review': '打开 {date} 的季度复盘',

  'csv.mapper.aria.map-column': '映射列 {header}',
  'trade-import.error.file-empty': '此文件为空。请重新导出文件后再试。',
  'trade-import.error.file-too-large':
    'Selected file exceeds the Trade Import size limit',
  'trade-import.error.file-type-unsupported':
    'Selected file type is not supported by Trade Import',
  'trade-import.error.broker-file-type-unsupported':
    'Selected broker does not support this file type',
  
  'quick-import.title': 'Quick Import',
  'quick-import.subtitle':
    'Use your favorite Trade Import setup to preview and import a file faster.',
  'quick-import.gate.sign-in':
    '登录或创建免费的 Journalit 账户，即可在 Trade Import 中预览文件。只有导入交易时才需要 Pro。',
  'quick-import.gate.sign-in-cta': '登录并免费预览',
  'quick-import.gate.pro': 'Quick Import is included with Trade Import Pro.',
  'quick-import.gate.preview-free': '免费预览文件',
  'quick-import.message.needs-setup':
    'Choose a favorite broker or template in Trade Import before using Quick Import.',
  'quick-import.message.capabilities-failed':
    'Quick Import setup could not be loaded.',
  'quick-import.message.mapping-required':
    'This file needs column mapping. Open the full Trade Import flow to review mappings.',
  'quick-import.message.preview-failed':
    'This file needs review in the full Trade Import flow.',
  'quick-import.message.no-importable':
    '未找到可导入的交易。请在 Trade Import 中查看此文件的详细信息。',

  'quick-import.privacy-note':
    '文件会上传到 Journalit 服务器进行处理，默认不会存储。',
  'quick-import.dropzone.title': 'Drop a broker export here',
  'quick-import.dropzone.subtitle': 'Or click to choose a file',

  'quick-import.status.checking-subscription': '正在检查订阅状态...',
  'quick-import.status.analysing': 'Analysing and preparing preview...',
  'quick-import.status.importing': 'Importing...',
  'quick-import.processing.sent-to-server':
    'Uploaded to Journalit for private processing',
  'quick-import.file.selected': 'Selected file',
  'quick-import.file.processed': 'Processed and ready to write to your vault',
  'quick-import.summary.title': '准备导入',

  'quick-import.summary.to-import': '待导入',
  'quick-import.summary.duplicates': '重复项',
  'quick-import.summary.failed': '需要检查',
  'quick-import.summary.failed-rows': '未导入的行',
  'quick-import.summary.incomplete-rows': '已跳过的不完整行',
  'quick-import.complete.title': 'Import complete',
  'quick-import.complete.message':
    '{written} written, {duplicates} duplicates, {failed} need review.',
  'quick-import.action.open-full': 'Open full Trade Import',
  'quick-import.action.review-in-trade-import': '在 Trade Import 中检查',
  'quick-import.action.setup-in-trade-import': 'Set up in Trade Import',
  'quick-import.action.replace-file': 'Replace file',
  'quick-import.action.import': 'Import trades',
  'quick-import.action.import-count.one': '导入 {count} 笔交易',
  'quick-import.action.import-count.few': '导入 {count} 笔交易',
  'quick-import.action.import-count.many': '导入 {count} 笔交易',
  'quick-import.action.import-count.other': '导入 {count} 笔交易',
  'quick-import.preview.more': '+ {count} more processed trades',

  'trade-import.notice.capabilities-failed':
    'Unable to load Trade Import capabilities',
  'trade-import.notice.open-failed': '无法打开 Trade Import',
  'trade-import.notice.template-exists':
    'A Trade Import template with this name already exists',
  'trade-import.notice.template-saved': 'Trade Import template saved',
  'trade-import.notice.analyse-failed': 'Trade Import analyse failed',
  'trade-import.notice.preview-failed': 'Trade Import preview failed',
  'trade-import.notice.free-preview-rate-limited':
    '已达到免费预览限制。请开通 PRO，或约 {minutes} 分钟后重试。',
  'trade-import.notice.free-preview-storage-limit-reached':
    '免费预览最多可存储 {limit} 笔交易。你已存储 {storedItems} 笔，此文件将新增 {requestedItems} 笔。请等待较早的预览过期或开通 PRO。',
  'trade-import.preview-error.guidance':
    '请检查所有必填字段是否已映射，所选日期格式是否与文件匹配，并且数字列是否包含有效的交易数值。',
  'trade-import.notice.complete':
    'Trade Import complete: {written} written or updated, {duplicateCount} duplicates, {failedCount} failed',
  'trade-import.gate.brand-left': '交易',
  'trade-import.gate.brand-right': '导入',
  'trade-import.gate.sign-in.title': '免费预览你的交易历史',
  'trade-import.gate.sign-in':
    '登录或创建免费的 Journalit 账户即可分析文件。只有导入交易时才需要 Pro。',
  'trade-import.gate.sign-in.reassurance':
    '你的文件会被私密处理，默认不会存储。',
  'trade-import.gate.sign-in.no-trial': '分析和预览无需开启 Pro 试用。',
  'trade-import.gate.sign-in.cta': '登录并免费预览',

  'trade-import.step.select': '1. Select import settings',
  'trade-import.step.privacy': '2. Privacy acknowledgement',
  'trade-import.step.analyse': '3. Analyse and map',
  'trade-import.step.preview': '4. Preview',
  'trade-import.label.template': 'Local mapping template',
  'trade-import.label.template-actions': 'Template actions',
  'trade-import.template.none': 'No template',
  'trade-import.label.account': 'Account',
  'trade-import.label.broker': '导出来源 / 平台',
  'trade-import.label.asset-type': 'Asset type',
  'trade-import.asset.stock': 'Stock',
  'trade-import.asset.options': 'Options',
  'trade-import.asset.futures': 'Futures',
  'trade-import.asset.forex': 'Forex',
  'trade-import.asset.crypto': 'Crypto',
  'trade-import.manual-mode.price-based': '订单或成交（合并为交易）',
  'trade-import.manual-mode.direct-pnl': '每行一笔交易（使用盈亏）',
  'trade-import.label.ai-mapping': 'Request AI mapping suggestions',
  'trade-import.privacy.copy':
    'Trade Import uploads the selected broker export to Journalit servers for processing. Broker exports may contain account identifiers, trade history, symbols, timestamps, prices, quantities, fees, balances, and P&L. For preview generation, Journalit also sends your selected account name, mapping/template choices, custom field definitions and saved options, and limited local open-trade context for IBKR open-position matching. Raw files are processed for this import and are not stored by default. When AI mapping suggestions are on, the column headers and a few sample rows are also sent to an AI model to suggest column matches; untick the option to map columns yourself.',

  'trade-import.action.analyse': 'Analyse file',
  'trade-import.action.choose-file': 'Choose file',
  'trade-import.guide.prompt': '不确定要导出什么？',
  'trade-import.guide.link': '查看券商指南',
  'trade-import.hyperliquid.export-guidance':
    '在 Hyperliquid 中选择 Trade History → Export as CSV，不要选择 Export More（独立的第三方报表）。不要使用 Funding History 或 Order History。',
  'trade-import.hyperliquid.date-us': '美式：月/日/年 - 24 小时制',
  'trade-import.hyperliquid.date-day-first':
    '日期在前：日/月/年，时间前可有或没有“ - ”',
  'trade-import.hyperliquid.date-german': '德式：日.月.年 - 24 小时制',
  'trade-import.hyperliquid.invalid-time-zone':
    '无法检测此设备的时区。请检查系统设置。',
  'trade-import.hyperliquid.backend-update-required':
    '预览 Hyperliquid 文件需要更新服务器。请稍后重试。',
  'trade-import.action.drop-file': 'Drop file to upload',
  'trade-import.analyse.detected':
    '已读取你的 {fileType} 文件。请检查下方各行，然后将每一列对应到交易字段。',
  'trade-import.table.screenshots': '截图',
  'trade-import.preview.screenshot-alt': '表格第 {row} 行 {symbol} 的截图',
  'trade-import.preview.screenshots-more': '还有 {count} 张',
  'trade-import.preview.include-screenshots':
    '将表格中的截图添加到对应交易（{count}）',
  'trade-import.completion.screenshots-added': '已从表格添加的截图：{count}',
  'trade-import.completion.screenshots-failed': '未能添加的表格截图：{count}',
  'trade-import.preview.import-anyway': '仍然导入',
  'trade-import.preview.import-anyway-aria': '仍然导入 {date} 的 {symbol}',
  'trade-import.preview.import-all-anyway':
    '仍然导入全部 {count} 条可能重复的交易',
  'csv.mapper.missing-fields.pnl-or-prices':
    '或者对应入场价、出场价和数量，按价格计算盈亏。',
  'trade-import.pnl-from-prices.title': '盈亏将根据你的价格计算',
  'trade-import.pnl-from-prices.body':
    '没有盈亏列，因此会用入场价、出场价和数量计算盈亏。只有资产类型正确时结果才对，请选择这些交易的类型。',
  'trade-import.pnl-from-prices.contract-size':
    '外汇和期货还需要合约规模列才能计算盈亏。如果没有，请改为对应你的盈亏列。',
  'trade-import.diagnostic.choose-date-format': '选择日期格式',
  'trade-import.date-question.ambiguous':
    '你的日期形如 {example}。这是哪一天？',
  'trade-import.date-question.mixed':
    '此列中有些日期的顺序不同，例如 {example}。你的大部分日期采用哪种顺序？',
  'trade-import.date-question.mixed-note':
    '采用另一种顺序的行会被列出，方便你在文件中修正。',
  'quick-import.message.date-order':
    '你的日期有两种读法。请打开完整导入进行选择。',
  'csv.date-format.eu-dot': '欧式点分：25.12.2024（日.月.年）',
  'csv.date-format.ymd-dot': '年份在前（点分）：2024.12.25',
  'trade-import.unmapped.title': '不会导入 ({count})',
  'trade-import.unmapped.body':
    '这些列没有对应到 Journalit 字段，将被忽略。如果有合适的字段，请在上方进行对应。',
  'trade-import.unmapped.keep': '保留为自定义字段',
  'trade-import.unmapped.keep-aria': '将 {header} 保留为自定义字段',
  'trade-import.custom-field.title': '将“{header}”保留为自定义字段',
  'trade-import.custom-field.hint':
    '为你的交易添加一个字段，并用此列的值填充。如果 Journalit 已有合适的字段，请改为对应到该字段。',
  'trade-import.custom-field.name': '字段名称',
  'trade-import.custom-field.type': '字段类型',
  'trade-import.custom-field.type.text': '文本',
  'trade-import.custom-field.type.number': '数字',
  'trade-import.custom-field.type.dropdown': '选项列表',
  'trade-import.custom-field.create': '创建字段',
  'trade-import.custom-field.error.reserved':
    '此名称已被内置交易字段使用，请换一个名称。',
  'trade-import.table.open-closed': '持仓/平仓',
  'trade-import.status.open': '持仓中',
  'trade-import.status.partially-closed': '部分平仓',
  'trade-import.status.closed': '已平仓',
  'trade-import.status.cancelled': '已取消',
  'trade-import.diagnostic.column': '列：{columns}',
  'trade-import.diagnostic.unmap-column': '不导入此列',
  'trade-import.diagnostic.edit-mapping': '更改映射',
  'trade-import.diagnostic.info': 'info',
  'trade-import.label.sheet': 'Sheet',
  'trade-import.label.header-row': 'Header row',
  'trade-import.placeholder.auto': 'Auto',
  'trade-import.label.date-format': 'Date format',

  'trade-import.label.save-template': 'Save mapping template',
  'trade-import.placeholder.template-name': 'Template name',
  'trade-import.action.save-template': 'Save template',
  'trade-import.action.preview': 'Generate preview',

  'trade-import.preview.found.one': '找到 {count} 笔交易',
  'trade-import.preview.found.few': '找到 {count} 笔交易',
  'trade-import.preview.found.many': '找到 {count} 笔交易',
  'trade-import.preview.found.other': '找到 {count} 笔交易',
  'trade-import.preview.date-range': '{start} 至 {end}',
  'trade-import.preview.metric.symbols': '品种',
  'trade-import.preview.metric.ready': '可导入',
  'trade-import.preview.metric.duplicates': '可能重复',
  'trade-import.preview.metric.attention': '需要处理',
  'trade-import.preview.completed.message': '{count} 笔交易已准备好导入。',
  'trade-import.preview.partial.message':
    '{count} 笔交易已准备就绪。{failed} 行无法导入，另有 {incomplete} 行因数据不完整而被跳过。',
  'trade-import.preview.partial.guidance': '仅会导入下方显示的有效交易。',

  'trade-import.preview.failed.message': '未能从此文件生成任何待导入交易。',
  'trade-import.preview.failed.guidance':
    '请检查列映射、日期格式、所选工作表和标题行，以及下方的无效值。',
  'trade-import.preview.tradovate-performance.title': 'Tradovate 报告不正确',
  'trade-import.preview.tradovate-performance.message':
    '这似乎是 Tradovate 的 Performance 导出。Journalit 需要导入 Orders 报告，才能准确重建您的成交记录。请在 Tradovate 中前往 Reports > Orders 并下载 CSV。',
  'trade-import.preview.tradovate-performance.guide': '查看 Tradovate 导出指南',
  'trade-import.preview.metatrader-statement.title':
    '不支持的 MetaTrader 对账单',
  'trade-import.preview.metatrader-statement.message':
    'Journalit 会导入原始的 MetaTrader 账户历史报告。请将 MetaTrader 设置为英文，打开 Account History / History，选择 Save as Report，然后上传未经编辑或转换的原始 .html 或 .htm 文件。',
  'trade-import.preview.metatrader-statement.guide': '查看 MetaTrader 导出指南',
  'trade-import.preview.tradingview-export.title': 'TradingView 导出文件不正确',
  'trade-import.preview.tradingview-export.message':
    'Journalit 需要 TradingView 模拟交易的 Order History / History CSV。请勿使用 Account History、图表数据、策略导出或其他 TradingView CSV 文件。',
  'trade-import.preview.tradingview-export.guide': '查看 TradingView 导出指南',
  'trade-import.source-recovery.title': '此文件看起来是 {source} 导出文件',
  'trade-import.source-recovery.message':
    'Journalit 可以直接使用 {source} 导入此文件，而不是 {selected}。',
  'trade-import.source-recovery.continue': '继续使用 {selected}',
  'trade-import.source-recovery.switch': '切换到 {source}',
  'trade-import.source-recovery.guide': '查看 {source} 导出指南',
  'trade-import.source-recovery.metatrader.message':
    'Journalit 可以直接导入此 MetaTrader 报表，无需映射列。',
  'trade-import.source-recovery.deepcharts.rithmic-message':
    '即使账户通过 Rithmic 执行，此文件也来自 DeepCharts。请使用 DeepCharts，以便从 Trade List 正确读取多头和空头交易。',
  'trade-import.source-recovery.deepcharts.manual-message':
    '请使用 DeepCharts 导入器。它会根据 Trade List 中带符号的 Quantity 或 Direction 列识别多空方向，因此无需手动映射。',
  'trade-import.source-recovery.motivewave.title':
    '此文件看起来是 MotiveWave 成交执行导出文件',
  'trade-import.source-recovery.motivewave.message':
    '请使用 MotiveWave，以便 Journalit 将执行记录正确配对为完整交易。',
  'quick-import.message.source-mismatch':
    'Journalit 检测到不同的导出来源。请在 Trade Import 中检查并切换来源，无需重新上传文件。',
  'trade-import.preview.no-eligible':
    '文件解析成功，但没有符合导入条件的新增或更新交易。请查看下方的重复项和分类详情。',
  'trade-import.pro-gate.title.one': '{count} 笔交易可导入',
  'trade-import.pro-gate.title.few': '{count} 笔交易可导入',
  'trade-import.pro-gate.title.many': '{count} 笔交易可导入',
  'trade-import.pro-gate.title.other': '{count} 笔交易可导入',
  'trade-import.pro-gate.subtitle':
    '激活 PRO 即可将它们作为交易笔记写入你的仓库。',
  'trade-import.pro-gate.cta': '激活 PRO',
  'trade-import.preview.diagnostics': '查看详情（{count}）',
  'trade-import.preview.affected-rows': '受影响的行：{count}',
  'trade-import.table.status': 'Status',
  'trade-import.table.symbol': 'Symbol',
  'trade-import.table.direction': 'Direction',
  'trade-import.table.entry-time': 'Entry time',
  'trade-import.table.date': 'Date',
  'trade-import.table.position': 'Position',
  'trade-import.table.result': 'Result',
  'trade-import.table.quantity': 'Quantity',
  'trade-import.table.message': 'Message',
  'trade-import.status.new': '新交易',
  'trade-import.status.already-imported': '已导入',
  'trade-import.status.other-account': '在其他账户中',
  'trade-import.status.other-account.detail': '已导入到 {account}',
  'trade-import.status.updates-existing': '更新现有交易',
  'trade-import.status.possible-duplicate': '可能重复',
  'trade-import.status.needs-review': '需要检查',
  'trade-import.status.duplicate-in-file': '文件内重复',
  'trade-import.status.invalid': '无效交易',
  'trade-import.status.no-open-trade': '没有可平仓的持仓交易',
  'trade-import.status.multiple-open-trades': '多笔持仓交易匹配',
  'trade-import.status.quantity-mismatch': '数量不匹配',
  'trade-import.server-deletion.deleted':
    '已从 Journalit 服务器删除的交易：{count}',
  'trade-import.server-deletion.kept': '因其他导入也包含而保留的交易：{count}',
  'trade-import.server-deletion.blocked-broker-connected':
    '此账户由券商连接同步。请断开券商连接以删除其数据。',
  'trade-import.server-deletion.blocked-broker-history':
    '此账户包含券商同步历史，无法在此删除。请改为逐个删除导入。',
  'trade-import.server-deletion.failed':
    '无法从 Journalit 服务器删除，请重试。',
  'trade-import.server-deletion.notice':
    '服务器删除后移至回收站的交易笔记：{count}',
  'trade-import.server-deletion.account.title': '删除服务器账户？',
  'trade-import.server-deletion.account.message':
    '这将从 Journalit 服务器永久删除“{account}”及其导入的交易（服务器上 {count} 笔），并在每个已同步的库中将其笔记移至回收站。之后可以重新导入文件。',
  'trade-import.server-deletion.account.confirm': '从服务器删除',
  'trade-import.server-deletion.account.button': '从服务器删除',
  'trade-import.history.title': '导入历史',
  'trade-import.completion.wrong-account': '导入到了错误的账户？',
  'trade-import.completion.undo-import': '撤销此次导入',
  'trade-import.action.manage-imports': '管理以往导入',
  'trade-sync.import.more-actions': '更多操作',
  'trade-import.history.loading': '正在加载导入历史…',
  'trade-import.history.load-failed': '无法加载导入历史。',
  'trade-import.history.empty': '暂无导入。',
  'trade-import.history.trades-on-server': '服务器上 {count} 笔',
  'trade-import.history.delete.title': '删除此导入？',
  'trade-import.history.delete.message':
    '这将从 Journalit 服务器永久删除此导入添加到“{account}”的交易（服务器上 {count} 笔），并在每个已同步的库中将其笔记移至回收站。其他导入也包含的交易会被保留。之后可以重新导入该文件。',
  'trade-import.history.delete.confirm': '删除导入',
  'trade-import.history.load-more': '加载更多',
  'account.edit.modal.delete.delete-server-trades':
    '同时从 Journalit 服务器删除其导入的交易（服务器上 {count} 笔）。即使你在此保留笔记，它们也会在每个已同步的库中移至回收站。',
  'trade-import.preview.other-account.message':
    '已在 {account} 中（{count}），将被跳过。',
  'trade-import.preview.other-account.import-instead': '改为导入到 {account}',
  'trade-import.preview.other-account.undo-earlier': '撤销之前的导入',
  'trade-import.action.confirm': 'Confirm import',
  'trade-import.action.activate-pro.one': '激活 PRO 以导入 {count} 笔交易',
  'trade-import.action.activate-pro.few': '激活 PRO 以导入 {count} 笔交易',
  'trade-import.action.activate-pro.many': '激活 PRO 以导入 {count} 笔交易',
  'trade-import.action.activate-pro.other': '激活 PRO 以导入 {count} 笔交易',
  'trade-import.action.cancel-preview': 'Cancel preview',
  'trade-import.broker.manual': 'Manual Mapping',
  'trade-import.source.title': '这些交易来自哪里？',
  'trade-import.source.subtitle':
    '选择你导出数据的平台。Journalit 会直接读取其文件格式，无需列映射。',
  'trade-import.source.search': '搜索经纪商和平台',
  'trade-import.source.sync-available': '也支持自动 Trade Sync',
  'trade-import.source.manual.tile': '自制表格 / 其他文件',
  'trade-import.source.manual.title': '自制表格或其他文件',
  'trade-import.source.manual.hint': '你需要将文件的列与 Journalit 字段对应。',
  'trade-import.source.native.hint': '文件格式会自动识别，无需映射。',
  'trade-import.source.guide': '如何导出',
  'trade-import.source.change': '更改',
  'trade-import.sync-suggestion.full.title': '{broker} 可以自动同步',
  'trade-import.sync-suggestion.full.body':
    'Trade Sync 会自动导入新交易，无需导出。你仍可以在下方导入文件。',
  'trade-import.sync-suggestion.partial.title': '使用 {provider}？改用同步',
  'trade-import.sync-suggestion.partial.body':
    'Trade Sync 会自动导入 {provider} 交易。其他结单仍可在下方导入。',
  'trade-import.sync-suggestion.action': '设置 Trade Sync',
  'trade-import.sync-suggestion.sync-only.title':
    '{broker} 通过 Trade Sync 连接',
  'trade-import.sync-suggestion.sync-only.body':
    '无需导出：Trade Sync 会自动导入你的 {broker} 交易。仍有 {broker} 文件？请选择“未列出 / 自定义文件”。',
  'trade-import.sync-suggestion.action.open': '打开 Trade Sync',

  'command.open-setups': '打开设置形态',
  'setups.create.title': '创建设置',
  'setups.create.field.name': '设置名称',
  'setups.create.placeholder.name': '开盘推动',
  'setups.create.field.status': '状态',
  'setups.create.field.direction': '方向',
  'setups.create.field.color': '色彩',
  'setups.create.field.color-description': '选择颜色以识别此设置。',
  'setups.create.profile.heading': '首选字段',
  'setups.create.profile.optional-label': '（可选）',
  'setups.create.field.sessions': '交易时段',
  'setups.create.field.preferred-sessions-tooltip':
    '在 设置 → 日志 → 会话模式 中管理这些交易时段。',
  'setups.create.placeholder.preferred-sessions': 'London, New York',
  'setups.create.field.timeframes': '时间周期',
  'setups.create.placeholder.preferred-timeframes': '5m, 15m, 1h',
  'setups.create.field.tickers': '交易品种',
  'setups.create.placeholder.preferred-tickers': 'ES, NQ, EURUSD',
  'setups.create.direction.any': '未指定',
  'setups.create.direction.long': '做多',
  'setups.create.direction.short': '做空',
  'setups.create.direction.both': '两者',
  'setups.create.field.linked-notes': '关联笔记',
  'setups.create.field.linked-notes-desc':
    '关联记录此设置 playbook 的现有笔记。',
  'setups.create.linked-notes.empty': '尚未关联笔记。',
  'setups.create.linked-notes.add': '+ 关联笔记',
  'setups.create.linked-notes.remove': '移除关联笔记',
  'setups.create.linked-notes.picker-title': '选择 playbook 笔记',
  'setups.create.linked-notes.search': '搜索笔记...',
  'setups.create.linked-notes.no-notes': '未找到 Markdown 笔记。',
  'setups.create.button.creating': '正在创建...',
  'setups.create.button.create': '创建设置',
  'setups.create.success': '设置 "{name}" 已成功创建',
  'setups.create.error.name-required': '设置名称为必填项',
  'setups.create.error.failed': '创建设置失败',
  'setups.edit.title': '编辑设置',
  'setups.edit.button.saving': '正在保存...',
  'setups.edit.button.save': '保存设置',
  'setups.edit.button.rename-and-update': '重命名并更新交易',
  'setups.edit.rename-warning.title': '重命名设置并更新交易',
  'setups.edit.rename-warning.message':
    '将 {oldName} 重命名为 {newName} 后，将更新使用旧设置名称的交易笔记。',
  'setups.edit.delete.button': '删除设置',
  'setups.edit.delete.title': '删除设置',
  'setups.edit.delete.confirm': '确认删除',
  'setups.edit.delete.warning':
    '删除“{name}”将永久移除该设置，并将其从关联交易中清除。此操作无法撤销。',
  'setups.edit.delete.success': '已删除设置“{name}”',
  'setups.edit.delete.error': '删除设置失败',
  'setups.edit.success': '设置 "{name}" 已成功更新',
  'setups.edit.error.failed': '更新设置失败',
  'setups.view.compare.empty-submessage':
    '从概览中选择两张设置卡片，以生成并排报告。',
  'setups.view.compare.reason.higher.total-r': '更高的总 R',
  'setups.view.compare.reason.lower.total-r': '更低的总 R',
  'setups.view.compare.reason.similar.total-r': '相近的总 R',

  'setups.guide.create-new-setup.title': '创建新设置',
  'setups.guide.create-new-setup.description':
    '想添加另一个剧本时使用“新建设置”。弹窗会引导你填写详情、关联笔记和规则。',
  'setups.guide.detail-intro.title': '这是设置页面',
  'setups.guide.detail-intro.description':
    '设置页面聚焦一个剧本，集中展示表现图、上下文、参考资料、操作和执行规则。',
  'setups.guide.detail-actions.title': '设置操作',
  'setups.guide.detail-actions.description':
    '使用这些按钮打开相关交易，或编辑设置详情、关联笔记、截图和剧本规则。',
  'setups.guide.empty.create-setup.title': '从“新建设置”开始',
  'setups.guide.empty.create-setup.description':
    '先创建一个设置。创建后，本指南会继续正常的设置流程。',

  'setups.guide.intro.title': '欢迎使用 Setups',
  'setups.guide.intro.description':
    '此视图把设置剧本、关联交易、笔记、截图和规则集中在一个地方。',
  'setups.guide.view-tabs.title': '切换设置视图',
  'setups.guide.view-tabs.description':
    '当有足够设置时，用这些标签在概览、设置组合和比较流程之间切换。',
  'setups.guide.overview-chart.title': '表现排名',
  'setups.guide.overview-chart.description':
    '概览图按所选指标排列设置。使用右上角控件可切换指标，或让图表聚焦到特定设置。',
  'setups.guide.tag-filter.title': '筛选策略',
  'setups.guide.tag-filter.description':
    '按策略标签或方向筛选卡片、图表、配对和比较选项。同一组内使用“或”逻辑，标签与方向之间使用“且”逻辑。',
  'setups.guide.setup-cards.title': '设置卡片',
  'setups.guide.setup-cards.description':
    '卡片用关键指标、状态、最近交易日期和小型表现趋势总结每个设置。',
  'setups.guide.open-detail.title': '打开设置页面',
  'setups.guide.open-detail.description':
    '准备好后，打开一个策略卡片查看其页面，那里会有一段简短的指南。',
  'setups.guide.detail-performance.title': '详情表现',
  'setups.guide.detail-performance.description':
    'Performance 标签显示该设置随时间的图表和关键指标，包括 P&L、胜率、期望值和回撤。',
  'setups.guide.detail-context.title': '设置上下文',
  'setups.guide.detail-context.description':
    '此面板集中显示设置健康度、需关注项、关联笔记和截图。',
  'setups.guide.detail-playbook.title': '剧本笔记',
  'setups.guide.detail-playbook.description':
    '剧本区域预览此设置的关联笔记。它可以是 Markdown、图片、Excalidraw 或任何参考资料。',
  'setups.guide.detail-rules.title': '执行规则',
  'setups.guide.detail-rules.description':
    '规则保存最佳条件、入场、风险和需避免错误的结构化清单。',
  'setups.guide.finish.title': 'Setups 指南已完成',
  'setups.guide.finish.description':
    '你已查看主要页面：概览、组合、比较和单个设置详情页。',

  'setups.guide.pairs-mode.title': '打开设置组合',
  'setups.guide.pairs-mode.description':
    '打开组合，查看哪些设置组合有足够的共同交易可供比较。',
  'setups.guide.pairs-chart.title': '组合排名',
  'setups.guide.pairs-chart.description':
    '组合模式会突出可能一起表现更好或更差的设置组合。点击柱条可打开该组合的更深入洞察。',

  'setups.guide.compare-mode.title': '开始比较模式',
  'setups.guide.compare-mode.description':
    '比较模式可选择两张设置卡片进行并排复盘。',
  'setups.guide.compare-select.title': '选择两个设置',
  'setups.guide.compare-select.description': '选择两张设置卡片以打开比较页面。',
  'setups.guide.compare-summary.title': '这是比较页面',
  'setups.guide.compare-summary.description':
    '此页面并排比较两个设置。顶部摘要行显示胜出者、期望值优势、置信度，以及某个设置可能更有优势的原因。',
  'setups.guide.compare-body.title': '比较摘要行',
  'setups.guide.compare-body.description':
    '顶部行总结比较结果：胜出者、期望值优势、置信度，以及优势背后的原因。',
  'setups.guide.compare-details.title': '比较详情',
  'setups.guide.compare-details.description':
    '使用指标表和累计图了解两个设置的差异。',
  'setups.guide.detail-execution-gap.title': '执行差距分析',
  'setups.guide.detail-execution-gap.description':
    '当有错过交易或回测数据时，此标签会将已捕捉的执行与错过或基准机会进行比较。',
  'setups.guide.back-to-overview.title': '返回设置卡片',
  'setups.guide.back-to-overview.description': '比较完成后返回设置卡片。',

  'setups.view.open-as-markdown': '以 Markdown 打开',
  'setups.view.open-as-setup': '以 Journalit 设置打开',

  'setups.view.overview.mode.pairs': '组合',
  'setups.view.pairs.summary-aria': '设置组合摘要',
  'setups.view.pairs.best': '最佳组合',
  'setups.view.pairs.worst': '最差组合',
  'setups.view.pairs.worst-short': '最差',
  'setups.view.pairs.empty': '尚无交易数达到 5 笔以上的设置组合。',
  'setups.view.pairs.empty-submessage':
    '两个设置共享足够多的关联交易后，才会显示组合。',
  'setups.view.pairs.privacy': '隐私模式开启时将隐藏组合绩效。',

  'setups.view.pairs.metric-aria': '组合指标',
  'setups.view.pairs.metric.edge': '组合优势',
  'setups.view.pairs.metric.edge-short': '优势',
  'setups.view.pairs.metric.expectancy': '组合期望值',

  'setups.view.pairs.together': '共同',
  'setups.view.pairs.table.setup-pair': '设置组合',

  'setups.view.pairs.evidence': '证据',
  'setups.view.pairs.edge-comparison': '优势比较',
  'setups.view.pairs.edge-caption': '综合优势：{edge}',
  'setups.view.overview.setup-filter.all': '设置：全部',
  'setups.view.overview.setup-filter.selected': '设置：已选择 {count} 个',
  'setups.view.overview.setup-filter.aria': '选择要显示的设置',
  'setups.view.overview.setup-filter.select-all': '全选',
  'setups.view.overview.setup-filter.clear': '清除',

  'setups.view.overview.pnl-chart.dropdown-label': 'Cumulative P&L',

  'setups.view.overview.pnl-chart.combined': '全部设置',
  'setups.view.overview.pnl-chart.selected-combined': '已选设置',

  'setups.view.overview.pnl-chart.hidden':
    '启用隐私模式时将隐藏设置的盈亏曲线。',
  'setups.view.overview.pnl-chart.trade': '交易',
  'setups.view.overview.pnl-chart.start': '开始',
  'setups.view.ranking.empty-submessage':
    '记录带有设置的交易，即可开始绩效排名。',
  'setups.view.empty.no-setups-submessage':
    '设置会将剧本笔记、规则、交易和绩效集中在一处。',
  'setups.view.detail.no-playbook-note': '关联剧本笔记以在此处预览。',
  'setups.view.detail.link-playbook-note': '关联笔记',
  'setups.view.detail.change-playbook-note': '更改笔记',

  'setups.view.detail.playbook-note-modal.empty': '未找到匹配的笔记。',
  'setups.view.detail.empty-playbook-note': '关联的剧本笔记为空。',
  'setups.view.detail.rules.edit': '编辑规则',

  'setups.view.detail.rules.add': '添加规则',

  'setups.view.detail.rules.empty-title': '构建设置交易计划',
  'setups.view.detail.rules.use-template': '使用模板',
  'setups.view.detail.rules.applying-template': '正在应用模板...',
  'setups.view.detail.rules.add-custom': '自定义规则',
  'setups.view.detail.rules.template-error': '应用交易计划模板失败。',
  'setups.view.detail.rules.template.best-conditions': '最佳条件',
  'setups.view.detail.rules.template.entry-criteria': '入场条件',
  'setups.view.detail.rules.template.invalidation': '失效条件',
  'setups.view.detail.rules.template.risk-management': '风险 / 管理',
  'setups.view.detail.rules.template.avoid-when': '避免情形',
  'setups.view.detail.rules.template.common-mistakes': '常见错误',
  'setups.view.detail.rules.template.rule.best-conditions':
    '市场背景支持此设置',
  'setups.view.detail.rules.template.rule.entry-criteria':
    '入场触发条件已明确定义',
  'setups.view.detail.rules.template.rule.invalidation': '入场前已明确失效条件',
  'setups.view.detail.rules.template.rule.risk-management':
    '风险可接受且目标明确',
  'setups.view.detail.rules.template.rule.avoid-when': '不存在需要避免的情形',
  'setups.view.detail.rules.template.rule.common-mistakes':
    '已避免已知的执行错误',
  'setups.view.detail.rules.field.label': '规则',
  'setups.view.detail.rules.field.description': '详情',
  'setups.view.detail.rules.field.group': '分组',
  'setups.view.detail.rules.move-up': '上移规则',
  'setups.view.detail.rules.move-down': '下移规则',
  'setups.view.detail.rules.delete': '删除规则',
  'setups.view.detail.rules.save-error': '保存设置规则失败。',
  'setups.view.detail.rules.validation-label':
    '请添加规则名称，或在保存前删除空白规则。',
  'setups.view.detail.rules.groups': '分组',
  'setups.view.detail.rules.add-group': '添加分组',
  'setups.view.detail.rules.new-group': '新建分组',
  'setups.view.detail.rules.validation-group':
    '添加分组名称，或在保存前移除空白分组。',
  'setups.view.detail.rules.summary': '{count} 条规则 · {groups} 组',

  'setups.view.detail.rule.category.context': '背景',
  'setups.view.detail.rule.category.entry': '入场',
  'setups.view.detail.rule.category.exit': '出场',
  'setups.view.detail.rule.category.risk': '风险',
  'setups.view.detail.rule.category.management': '管理',
  'setups.view.detail.rule.category.invalidation': '失效',
  'setups.view.detail.rule.category.psychology': '心理',
  'setups.view.detail.performance.drawdown': '回撤',
  'setups.view.detail.performance.empty-submessage':
    '使用此设置的交易将在你开始记录后显示在这里。',
  'setups.view.detail.analysis.performance': '绩效',
  'setups.view.detail.analysis.execution-gap': '执行差距',
  'setups.view.detail.analysis.tabs-aria': '设置绩效标签页',
  'setups.view.detail.brief.linked-notes-add': '编辑关联笔记',

  'setups.view.detail.execution-gap.live-pnl': '实盘盈亏',
  'setups.view.detail.execution-gap.live-r': '实盘 R',
  'setups.view.detail.execution-gap.missed-edge': '错过的优势',
  'setups.view.detail.execution-gap.live-plus-missed': '实盘 + 错过',
  'setups.view.detail.execution-gap.backtest': '回测',

  'setups.view.detail.execution-gap.capture-rate': '捕捉率',
  'setups.view.detail.execution-gap.capture-rate-tooltip':
    '实盘盈亏 ÷ (实盘盈亏 + 错过交易的盈亏)。显示你捕捉到的可用优势比例。',
  'setups.view.detail.execution-gap.average-r-delta': '平均 R 变动',
  'setups.view.detail.execution-gap.live-execution': '实盘执行',
  'setups.view.detail.execution-gap.backtest-benchmark': '回测基准',
  'setups.view.detail.execution-gap.hidden': '隐私模式下将隐藏执行差距。',
  'setups.view.detail.execution-gap.empty':
    '记录此设置的错过交易或回测交易，以分析执行差距。',
  'setups.view.detail.brief.linked-notes': '{count}',
  'setups.view.detail.brief.linked-notes-modal.subtitle': '{name}',
  'setups.view.detail.brief.screenshots': '{count}',
  'setups.view.detail.brief.no-screenshots': '尚未关联截图。',
  'setups.view.detail.brief.screenshot-alt': '{index}',
  'setups.view.detail.brief.screenshot-open': '{index}',
  'setups.view.detail.brief.count.rules': '{count}',
  'setups.view.detail.brief.count.notes': '{count}',
  'setups.view.detail.brief.count.images': '{count}',
  'setups.view.detail.brief.count.trades': '{count}',
  'setups.view.detail.brief.more': '{count}',
  'setups.view.detail.attention.title': '需要关注',
  'setups.view.detail.attention.count': '{count} 项',
  'setups.view.detail.attention.empty': '未发现设置问题。',
  'setups.view.detail.attention.show-more': '+{count} 项',
  'setups.view.detail.attention.show-less': '收起',
  'setups.view.detail.attention.no-playbook-title': '关联剧本笔记',
  'setups.view.detail.attention.no-playbook-detail':
    '关联一份源笔记，用于记录背景和示例。',
  'setups.view.detail.attention.no-rules-title': '构建执行交易计划',
  'setups.view.detail.attention.no-rules-detail':
    '添加入场、失效、风险和错误的判断标准。',

  'setups.view.detail.attention.no-trades-title': '尚无实盘交易',
  'setups.view.detail.attention.no-trades-detail': '尚无关联的实盘交易记录。',
  'setups.view.detail.attention.no-screenshots-title': '保存示例截图',
  'setups.view.detail.attention.no-screenshots-detail':
    '将截图附加到交易中，作为复盘示例。',
  'setups.view.detail.attention.stale-title': '复盘近期适用性',
  'setups.view.detail.attention.stale-detail': '此设置已有 {count} 天未交易。',
  'setups.view.detail.attention.profit-factor-title': '绩效需要复盘',
  'setups.view.detail.attention.profit-factor-detail':
    '关联交易的利润因子低于 1.0。',
  'setups.view.detail.attention.expectancy-title': '期望值为负',
  'setups.view.detail.attention.expectancy-detail':
    '关联交易的平均结果低于盈亏平衡点。',
  'setups.view.card.open-named': '{name}',
  'setups.view.card.status.active': '稳定',
  'setups.view.card.status.monitor': '监控',
  'setups.view.card.status.review': '复盘',
  'setups.view.date.days-ago': '{count}',

  'trade-import.restore.complete':
    'Restored {written} imported trades; {failed} failed.',
  'trade-import.restore.broker-label': 'Backend restore',
  'trade-sync.source.metatrader': 'MetaTrader',
  'trade-sync.providers.title': '交易同步',

  'trade-sync.source.trade-import': 'Trade Import',
  'trade-sync.source.tradovate': 'Tradovate',
  'trade-sync.source.metatrader.description':
    'Sync trades from MetaTrader reports uploaded through your FTP connection.',
  'trade-sync.source.trade-import.description':
    'Restore broker-file imports across vaults and recover missing local trade notes.',
  'trade-sync.source.tradovate.description':
    'Synchronize Tradovate trades in the cloud and project them into this vault.',
  'trade-sync.tradovate.status-failed': 'Unable to load Tradovate status.',
  'trade-sync.tradovate.last-sync': 'Last sync',
  'trade-sync.tradovate.last-projection': 'Last projection',
  'trade-sync.tradovate.pending-projections': '{count} pending projection(s)',
  'trade-sync.tradovate.pending-acks': '{count} 个本地 ACK 待处理',
  'trade-sync.source.rithmic': 'Rithmic',
  'trade-sync.source.rithmic.description':
    '在云端同步 Rithmic 交易，并投射到此仓库。',
  'trade-sync.rithmic.plugin-sync-description':
    '先在 Journalit.co 连接 Rithmic，然后在此同步，将最新的 Rithmic 活动写入此仓库。',
  'trade-sync.rithmic.status-failed': '无法加载 Rithmic 状态。',
  'trade-sync.rithmic.status.connecting': '连接中',
  'trade-sync.rithmic.status.paused': '已暂停',
  'trade-sync.rithmic.status.waiting-for-accounts': '正在等待账户',
  'trade-sync.rithmic.status.reauthorization-required':
    '需要在 Journalit.co 重新授权',
  'trade-sync.rithmic.status.error': '连接错误',
  'trade-sync.rithmic.no-connections':
    '请在 Journalit.co 连接 Rithmic 账户，然后在此同步。',
  'trade-sync.rithmic.connect': '连接',
  'trade-sync.rithmic.manage': '在 Journalit.co 管理',
  'trade-sync.rithmic.system': 'Rithmic 系统',
  'trade-sync.rithmic.accounts': '账户',
  'trade-sync.rithmic.last-sync': '上次同步',
  'trade-sync.rithmic.never': '从未',
  'trade-sync.rithmic.job.running': '正在同步…',
  'trade-sync.rithmic.job.last': '最近任务：{status}',
  'trade-sync.job.status.queued': '排队中',
  'trade-sync.job.status.running': '运行中',
  'trade-sync.job.status.succeeded': '已成功',
  'trade-sync.job.status.partial': '部分完成',
  'trade-sync.job.status.failed': '失败',
  'trade-sync.job.status.cancelled': '已取消',
  'trade-sync.job.status.unknown': '未知',
  'trade-sync.rithmic.sync-to-vault': '同步',
  'trade-sync.rithmic.syncing': '同步中…',
  'trade-sync.rithmic.mapping-required':
    '请为每个同步的 Rithmic 账户选择一个本地仓库账户。',
  'trade-sync.rithmic.sync-complete-connection': '{connection} 同步完成。',
  'trade-sync.rithmic.sync-partial-connection':
    '{connection} 同步完成，但存在问题。',
  'trade-sync.rithmic.sync-all': '全部同步',
  'trade-sync.rithmic.sync-all-complete':
    '已同步 {succeeded}/{total} 个 Rithmic 连接。',
  'trade-sync.rithmic.sync-all-partial':
    '已同步 {succeeded}/{total} 个 Rithmic 连接。请检查存在问题的连接。',
  'trade-sync.rithmic.error.session-conflict':
    'Rithmic 只允许一个活动会话。请关闭使用该 Rithmic 登录的 R|Trader、NinjaTrader 或其他平台。',
  'trade-sync.rithmic.error.auto-retry': 'Journalit 会自动重试。',
  'trade-sync.rithmic.error.invalid-credentials':
    'Rithmic 拒绝了已保存的凭据。请在 Journalit.co 更新后重试。',
  'trade-sync.rithmic.error.agreements-required':
    'Rithmic 要求先在 R|Trader 中签署行情数据协议。签署后请重试。',
  'trade-sync.rithmic.error.disabled':
    '此连接的 Rithmic 同步已停用。请在 Journalit.co 管理。',
  'trade-sync.rithmic.error.sync-failed':
    'Rithmic 同步失败。请在 Journalit.co 检查连接后重试。',
  'trade-sync.broker.mapping-unsaved-hint': '映射将在同步时保存。',
  'trade-sync.broker.sync-all-blocked.unsaved-changes':
    '账户更改尚未保存。同步该连接即可保存。',
  'trade-sync.broker.sync-all-blocked.mapping-required':
    '请先为每个要同步的账户选择一个 Journalit 账户。',
  'trade-sync.broker.sync-all-blocked.running-job': '已有同步正在进行。',
  'trade-sync.broker.sync-all-blocked.not-ready': '没有连接可以同步。',
  'trade-sync.rithmic.connect-another': '连接另一个 Rithmic 账户',
  'trade-sync.rithmic.error.sync-failed-detail': 'Rithmic 同步失败：{message}',
  'trade-sync.tradovate.never': 'Never',

  'trade-sync.import.card.inventory-summary':
    '{accounts} account(s) · {trades} trade(s)',
  'trade-sync.import.action.check': 'Check',

  'trade-sync.import.action.open-import': 'Open Trade Import',

  'trade-sync.import.action.create-local-account': '创建账户',

  'trade-sync.import.action.restore-account': 'Restore',
  'trade-sync.import.action.restoring': 'Restoring…',

  'trade-sync.import.pending-acks': '{count} pending ACK(s)',

  'trade-sync.import.empty-accounts':
    'No backed-up Trade Import accounts found yet.',
  'trade-sync.import.account.restorable-count': '{count} restorable',
  'trade-sync.import.account.synced-count': '{count} synced',
  'trade-sync.import.account.missing-count': '{count} missing',
  'trade-sync.import.account.issue-count': '{count} issue(s)',
  'trade-sync.import.account.local-account': 'Journalit 账户',
  'trade-sync.import.notice.restored': 'Restored {count} imported trade(s).',

  'trade-sync.import.notice.sync-cloud-failed':
    'Unable to start cloud synchronization.',
  'trade-sync.import.notice.load-failed':
    'Could not load Trade Import sync status.',
  'trade-sync.import.notice.mapping-failed':
    'Could not save Trade Import account mapping.',
  'trade-sync.import.notice.create-account-failed':
    'Could not create local account.',
  'trade-sync.import.notice.restore-failed':
    'Could not restore Trade Import account.',
  'trade-sync.rate-limit.action.mapping': '账户映射',
  'trade-sync.import.notice.rate-limited':
    '{action}：请求过于频繁。请在 {seconds} 秒后重试。',
  'setups.view.loading': '正在加载设置…',
  'settings.general.copy-trading-pnl-toggled': 'Copy trading PnL is {status}',
  'setups.view.trade.unknown-instrument': '未知品种',
  'command.open-session-mode': '打开实时会话',
  'view.session-mode': '实时会话',
  'widget.session-log.name': '会话日志',
  'widget.session-log.description': '记录带时间戳的执行笔记和交易事件。',
  'session-log.title': '实时会话日志',
  'session-log.description': '记录当前交易会话中发生的事情。',
  'session-log.notice.invalid-timestamp': '请输入有效的会话日志时间戳。',
  'session-log.action.auto-time': '自动时间',
  'session-log.action.set-time': '设置时间',

  'session-log.composer.tag-label': '会话日志标签',
  'session-log.placeholder.entry-short': '添加会话备注...',
  'session-log.action.add-entry': '添加带时间戳的条目',
  'session-log.action.add-note': '添加',
  'session-log.action.hide-composer': '隐藏编辑器',
  'session-log.filter.all': '全部',
  'session-log.filter.label': '筛选会话日志',
  'session-log.filter.clear': '清除筛选',
  'session-log.timeline.most-recent': '最新',
  'session-log.timeline.start': '会话开始',
  'session-log.empty': '还没有会话日志条目。',
  'session-log.empty-filtered': '没有符合此筛选条件的条目。',
  'session-log.loading': '正在加载会话日志…',
  'session-log.lessons.title': 'Lessons learned',

  'session-log.lessons.badge': 'LSN',
  'session-log.session-group.outside': '会话之外',

  'session-log.trade.entered': '入场',
  'session-log.trade.exited': '出场',
  'session-log.trade.size': '仓位',

  'session-log.status.unclassified': 'unclassified',
  'session-log.action.save': '保存',
  'session-log.action.cancel': '取消',

  'session-log.action.classify': 'Classify',
  'session-log.action.edit': '编辑',
  'session-log.action.delete': '删除',
  'session-log.action.open-trade': '打开交易',
  'session-log.preview':
    '会话日志预览：实时会话期间，带时间戳的笔记和交易事件会显示在这里。',
  'session-log.alert.tag-concentration':
    '{tag} 占会话笔记的 {percentage}%（{count}/{total}）。继续前请检查是否出现行为偏移。',

  'session-mode.loading': '正在加载会话模式',

  'session-mode.section.timeline': '时间线',
  'session-mode.title.ended': '会话已结束',

  'session-mode.title.break': '会话休息',
  'session-mode.title.live': '实时会话',
  'session-mode.title.preparation': '会话准备',

  'session-mode.prep.resources': '资源',

  'session-mode.action.open-drc-for-date': '打开 {date} 的 DRC',
  'session-mode.ended.helper': '记录你的交易或回顾当天表现。',
  'session-mode.ended.action.import-trades': '导入交易',
  'session-mode.ended.action.add-trade-manually': '手动添加交易',
  'session-mode.ended.action.open-drc': '打开 DRC',
  'session-log.session-group.unplanned': '计划外 @ {time}',
  'session-mode.unplanned.name': '计划外交易时段',
  'session-mode.unplanned.start': '开始计划外交易时段',
  'session-mode.unplanned.stop': '结束时段',
  'session-mode.unplanned.badge': '计划外',
  'session-mode.unplanned.status.live': '{time} 开始 · 已进行 {elapsed}',
  'session-mode.unplanned.ended.summary':
    '计划外交易时段 · {start}–{end} · {duration}',
  'session-mode.unplanned.modal.title': '开始计划外交易时段',
  'session-mode.unplanned.modal.description':
    '当前不在你计划的交易时段内。此时段将在每日复盘中标记为计划外。请写下你现在交易的原因。',
  'session-mode.unplanned.modal.reason-label': '原因',
  'session-mode.unplanned.modal.reason-placeholder':
    '例如：14:00 FOMC、错过了上午时段',
  'session-mode.unplanned.modal.reason-required': '开始前请填写原因。',
  'session-mode.unplanned.notice.started': '计划外交易时段已开始。',
  'session-mode.unplanned.notice.stopped': '计划外交易时段已结束。',
  'session-mode.unplanned.notice.blocked-live': '已有一个交易时段正在进行。',
  'session-mode.unplanned.notice.none-running':
    '当前没有进行中的计划外交易时段。',
  'session-mode.unplanned.notice.failed':
    '无法更新计划外交易时段。请查看控制台了解详情。',
  'session-mode.ended.stat.trades': '交易',
  'session-mode.ended.stat.notes': '笔记',
  'session-mode.ended.stat.gate-checks': 'Gate 检查',
  'session-mode.waiting.next-session': '下一场会话',
  'session-mode.waiting.starts-at': '{session} 将于 {time} 开始',
  'session-mode.waiting.preparation-opens-in':
    '准备阶段将在 {remaining} 后开启',
  'session-mode.waiting.open-drc': '打开 DRC',

  'session-mode.break.reset-before': '在 {session} 前重置状态',
  'session-mode.break.reset': '在下一场会话前重置状态',
  'session-mode.break.next-session-meta':
    '下一场会话 {time} 开始 · 剩余 {remaining}',
  'session-mode.break.description':
    '离开屏幕，喝点水，在下一场会话前清空思绪。',
  'session-mode.break.open-drc': '打开 DRC',
  'session-mode.countdown.starts-in': '距离开始',
  'session-mode.countdown.starts-at': '{session} 于 {time} 开始',
  'session-mode.countdown.hours': '小时',
  'session-mode.countdown.minutes': '分钟',
  'session-mode.countdown.seconds': '秒',
  'session-mode.phase.preparation': '准备',
  'session-mode.phase.live': '进行中',
  'session-mode.phase.waiting': '等待中',
  'session-mode.phase.break': '休息',
  'session-mode.phase.ended': '已结束',
  'session-mode.phase.unconfigured': '未配置会话时间表',
  'session-mode.status.preparation':
    '{session} 将在 {time} 开始。你还有 {remaining} 可以准备。',
  'session-mode.status.preparation-generic': '为下一场实时交易会话做准备。',
  'session-mode.status.waiting':
    '{session} 于 {time} 开始。准备阶段将在 {remaining} 后开始。',
  'session-mode.status.waiting-generic':
    '你的下一场会话已安排，但准备阶段还没有开始。',
  'session-mode.status.live': '本次会话还剩 {remaining}。',
  'session-mode.status.live-generic': '你的交易会话正在进行。',
  'session-mode.status.break':
    '{session} 将在 {time} 开始。你还有 {remaining} 的休息时间。',
  'session-mode.status.break-generic': '你正处于交易会话之间。',
  'session-mode.status.ended': '你配置的交易会话目前已结束。',
  'session-mode.status.unconfigured':
    '配置会话窗口后即可启用准备、进行中、休息和结束阶段。今天 DRC 的时间线仍可使用。',

  'session-mode.unconfigured.title': '设置你的交易时间',
  'session-mode.unconfigured.description':
    '添加你实际交易的时间，这样会话模式就能在准备、实时、休息和结束阶段之间自动切换。',
  'session-mode.unconfigured.step.window.title': 'Add a session window',

  'session-mode.unconfigured.step.prep.title': 'Review preparation timing',

  'session-mode.unconfigured.step.gate.title': 'Use the Starter Trade Gate',

  'session-mode.unconfigured.step.log.title': 'Log notes during live sessions',

  'session-mode.unconfigured.action': '配置会话模式',
  'session-mode.guide.why.title': '按计划交易，而不是凭心情',
  'session-mode.guide.why.description':
    '交易时段模式在每个时段前帮你准备，进行中用 Trade Gate 让你守住规则，并保存带时间戳的日志以便回放这一天。设置只需两分钟。',
  'session-mode.guide.configure.title': '现在就设置',
  'session-mode.guide.configure.description':
    '添加你的时段时间并创建第一个 Trade Gate。设置页里会有简短的引导。',
  'session-mode.guide.preparation.countdown.title': '你的时段即将开始',
  'session-mode.guide.preparation.countdown.description':
    '这是准备阶段。倒计时显示何时进入进行中，页面会自动切换到进行中模式。',
  'session-mode.guide.preparation.goals.title': '设定今天的目标',
  'session-mode.guide.preparation.goals.description':
    '开盘前写下怎样才算一个好时段，给自己一个可以对照的标准。',
  'session-mode.guide.preparation.checklist.title': '过一遍清单',
  'session-mode.guide.preparation.checklist.description':
    '在这里勾选你的时段前例行事项。勾选的内容会保存到今天的复盘笔记。',
  'session-mode.guide.preparation.next.title': '进入进行中后',
  'session-mode.guide.preparation.next.description':
    '你的 Trade Gate 和时段日志会出现在这里。第一次我们会带你看一遍。',
  'session-mode.guide.live.trade-gate.title': '每笔交易前先过 Trade Gate',
  'session-mode.guide.live.trade-gate.description':
    '点击开始并回答根据你的标准生成的问题。闸门以绿灯、等待或不交易结束，让你只做系统允许的交易。',
  'session-mode.guide.live.session-log.title': '记录你的所见所感',
  'session-mode.guide.live.session-log.description':
    '随时记下形态、情绪和决定。每条记录都有时间戳，之后可以准确回放当时发生了什么。',
  'session-mode.guide.live.settings.title': '随时调整',
  'session-mode.guide.live.settings.description':
    '“编辑”会打开时段模式设置：时段时间、阶段布局、Trade Gate 流程和日志标签。',
  'session-mode.guide.ended.review.title': '现在复盘这个时段',
  'session-mode.guide.ended.review.description':
    '打开今天的 DRC 进行复盘。把时段日志小组件加入 DRC 布局，每条带时间戳的记录都会显示在那里。',
  'settings.session-mode.guide.setting-name': '引导',
  'settings.session-mode.guide.setting-desc':
    '这些设置的简短导览，从时段时间到你的第一个 Trade Gate。',
  'settings.session-mode.guide.replay': '显示引导',
  'settings.session-mode.guide.intro.title': '来设置交易时段模式',
  'settings.session-mode.guide.intro.description':
    '四件事：时段何时进行、每个阶段显示什么、你的 Trade Gate，以及时段日志标签。',
  'settings.session-mode.guide.lead-time.title': '准备提前时间',
  'settings.session-mode.guide.lead-time.description':
    '准备阶段在时段开始前多少分钟开启。',
  'settings.session-mode.guide.windows.title': '添加你的时段窗口',
  'settings.session-mode.guide.windows.description':
    '每个交易时段一个窗口，包含名称、开始和结束时间。时段模式据此判断何时准备、何时进行中。',
  'settings.session-mode.guide.layout.title': '选择每个阶段显示的内容',
  'settings.session-mode.guide.layout.description':
    '按阶段开关模块：准备阶段的资源、目标和清单；进行中的 Trade Gate 和时段时间线。',
  'settings.session-mode.guide.trade-gate.title': '创建你的 Trade Gate',
  'settings.session-mode.guide.trade-gate.description':
    '首次点击“添加”会用常见问题生成一个入门流程，之后创建空流程；“库”里有现成的问题。每个问题指向下一个问题或一个结果：绿灯、等待或不交易。',
  'settings.session-mode.guide.editor.title': '问题与结果',
  'settings.session-mode.guide.editor.description':
    '展开一个流程来添加问题，并设定每个答案通向哪里。播放按钮会按时段中的实际方式运行它。',
  'settings.session-mode.guide.tags.title': '时段日志的标签',
  'settings.session-mode.guide.tags.description':
    '记录时为笔记打上标签，例如情绪或策略，方便在复盘中筛选。',
  'settings.session-mode.guide.finish.title': '设置完成',
  'settings.session-mode.guide.finish.description':
    '从侧栏或首页打开时段模式。把时段日志小组件加入 DRC 布局，即可在每次复盘中查看记录。',

  'session-mode.layout.empty.title': 'Nothing enabled for this phase',
  'session-mode.layout.empty.description':
    'Turn modules back on to build this Session Mode phase.',
  'session-mode.duration.minutes': '{minutes}分钟',
  'session-mode.duration.hours': '{hours}小时',
  'session-mode.duration.hours-minutes': '{hours}小时 {minutes}分钟',
  'settings.session-mode.title': '实时会话',
  'settings.session-mode.description':
    '配置交易时段、准备、阶段布局、Trade Gate 工作流和会话日志标签。',
  'settings.session-mode.preparation-lead-time': '准备提前时间（分钟）',
  'settings.session-mode.preparation-lead-time-desc':
    '会话开始前多久进入准备模式。',
  'settings.session-mode.windows': '会话窗口',

  'settings.session-mode.add-window-short': '添加',
  'settings.session-mode.no-windows':
    '尚未配置会话窗口。实时时间线仍可使用，但添加窗口后才会启用阶段化准备。',
  'settings.session-mode.layout.title': 'Phase layout',

  'settings.session-mode.layout.phase-desc.preparation':
    'Choose what appears during pre-session preparation before trading starts.',
  'settings.session-mode.layout.phase-desc.live':
    'Choose what appears while a configured trading session is live.',

  'settings.session-mode.layout.phase-desc.ended':
    'Choose what appears after all configured trading sessions have ended.',
  'settings.session-mode.layout.reset-phase': 'Reset',

  'settings.session-mode.layout.module.preparation-resources': 'Resources',
  'settings.session-mode.layout.module.preparation-resources-desc':
    'Shows linked preparation notes and playbooks.',
  'settings.session-mode.layout.module.preparation-goals': 'Goals',
  'settings.session-mode.layout.module.preparation-goals-desc':
    'Shows the DRC goals widget for pre-session focus.',
  'settings.session-mode.layout.module.preparation-checklist': 'Checklist',
  'settings.session-mode.layout.module.preparation-checklist-desc':
    'Shows the DRC checklist widget for pre-session preparation.',
  'settings.session-mode.layout.module.trade-gate': 'Trade Gate',
  'settings.session-mode.layout.module.trade-gate-desc':
    'Runs your configured IF/THEN gate during the live session.',
  'settings.session-mode.layout.module.timeline': 'Session timeline',
  'settings.session-mode.layout.module.timeline-desc':
    'Shows current-session notes and trade timeline entries.',

  'settings.session-mode.layout.module.ended-actions': 'End-of-session actions',
  'settings.session-mode.layout.module.ended-actions-desc':
    'Shows import, manual trade, and DRC actions after sessions end.',
  'settings.session-mode.layout.module.ended-stats': 'Session stats',
  'settings.session-mode.layout.module.ended-stats-desc':
    'Shows trade, note, and gate-check totals for the day.',
  'settings.session-mode.linked-resources': '链接资源',
  'settings.session-mode.linked-resources-desc': '在准备阶段显示快速笔记链接。',
  'settings.session-mode.linked-resources-count': '{count} linked',
  'settings.session-mode.linked-resources-hide': 'Hide linked',
  'settings.session-mode.session-log': '会话日志',
  'settings.session-mode.session-log-desc':
    '选择要显示在会话笔记旁边的自动事件。',
  'settings.session-mode.show-trade-executions': '交易入场与出场',
  'settings.session-mode.show-trade-executions-desc':
    '在会话模式和每日复盘日志中显示交易入场和出场。',
  'settings.session-mode.session-log-tags': '会话日志标签',
  'settings.session-mode.session-log-tags-desc':
    '自定义会话模式输入栏和 DRC 会话日志中可用的标签。',
  'settings.session-mode.tag-label-placeholder': '标签名称',
  'settings.session-mode.tag-short-label-placeholder': '短标签',
  'settings.session-mode.tag-label-example': 'Trade',
  'settings.session-mode.tag-short-label-example': 'TR',
  'settings.session-mode.tag-color': '标签颜色',
  'settings.session-mode.tag-requires-resolution': '需要处理',
  'settings.session-mode.tag-lesson': '课程标签',
  'settings.session-mode.tag-requires-resolution-tooltip':
    '带有此标签的条目会被标记为待跟进，直到你在会话日志中将其处理完成。适用于会话后需要复盘或采取行动的备注。',
  'settings.session-mode.tag-lesson-tooltip':
    '将此标签标记为学习条目。带有课程标签的备注可作为课程显示，并在会话日志流程中突出为学习时刻。',
  'settings.session-mode.add-session-log-tag': '添加会话日志标签',
  'settings.session-mode.reset-session-log-tags': '重置会话日志标签',
  'settings.session-mode.tag-color.blue': '蓝色',
  'settings.session-mode.tag-color.indigo': '靛蓝',
  'settings.session-mode.tag-color.purple': '紫色',
  'settings.session-mode.tag-color.green': '绿色',
  'settings.session-mode.tag-color.pink': '粉色',
  'settings.session-mode.tag-color.amber': '琥珀色',
  'settings.session-mode.tag-color.red': '红色',
  'settings.session-mode.tag-color.orange': '橙色',

  'settings.session-mode.search-resource-placeholder': '搜索库中文件以链接…',

  'settings.session-mode.window-name': '会话名称',
  'settings.session-mode.window-name-placeholder': '例如 NY AM',

  'settings.session-mode.start-time': '开始时间',
  'settings.session-mode.end-time': '结束时间',

  'trade-gate.workflow': '工作流',

  'trade-gate.action.start-short': 'Start',
  'trade-gate.action.start-another': '再开始一次',
  'trade-gate.outcome.green-light': '绿灯',
  'trade-gate.outcome.green-light-description': '条件已满足。',
  'trade-gate.outcome.no-trade': '不交易',
  'trade-gate.outcome.no-trade-description': '条件未满足。',
  'trade-gate.outcome.wait': '等待',
  'trade-gate.outcome.wait-description': 'Setup 尚未准备好。等待下一次机会。',
  'settings.session-mode.trade-gate.title': 'Trade Gate 工作流',
  'settings.session-mode.trade-gate.desc':
    '为实时入场检查创建 IF/THEN 决策流程。',
  'settings.session-mode.trade-gate.delete-workflow.title':
    '删除 Trade Gate 工作流？',
  'settings.session-mode.trade-gate.delete-workflow.message':
    '删除“{name}”？这将移除此工作流中的所有问题和分支，且无法撤销。',
  'settings.session-mode.trade-gate.delete-workflow.confirm': '删除工作流',
  'settings.session-mode.trade-gate.name': '工作流名称',
  'settings.session-mode.trade-gate.edit-question': '编辑问题',
  'settings.session-mode.trade-gate.no-options': '为此问题添加答案选项。',
  'settings.session-mode.trade-gate.not-wired': '尚未连接',
  'settings.session-mode.trade-gate.not-wired-hint': '点击以连接',
  'settings.session-mode.trade-gate.target-group-questions': '问题',
  'settings.session-mode.trade-gate.target-current': '当前：{title}',
  'settings.session-mode.trade-gate.target-group-outcomes': '结果',
  'settings.session-mode.trade-gate.new-question-target': '+ 新问题',
  'settings.session-mode.trade-gate.outcome-note': '结果备注（仅限此分支）',
  'settings.session-mode.trade-gate.remove-from-workflow': '从此工作流中移除',
  'settings.session-mode.trade-gate.used-in-workflows':
    '已用于 {count} 个工作流',
  'settings.session-mode.trade-gate.not-used': '尚未使用',
  'settings.session-mode.trade-gate.question-count': '{count} 个问题',
  'settings.session-mode.trade-gate.library-title': '问题库',
  'settings.session-mode.trade-gate.library-search': '搜索问题…',
  'settings.session-mode.trade-gate.library-empty':
    '未找到问题。创建一个问题即可开始。',
  'settings.session-mode.trade-gate.delete-question.title': '删除问题？',
  'settings.session-mode.trade-gate.delete-question.message':
    '从问题库中删除“{name}”？此操作无法撤销。',
  'settings.session-mode.trade-gate.delete-question.message-used':
    '从问题库中删除“{name}”？它用于：{workflows}。这些工作流中的分支也将被移除。此操作无法撤销。',
  'settings.session-mode.trade-gate.delete-question.confirm': '删除问题',
  'settings.session-mode.trade-gate.unplaced-title': '此工作流中尚未连接',
  'settings.session-mode.trade-gate.no-start': '选择一个起始问题以查看流程图。',
  'settings.session-mode.trade-gate.untitled': '未命名流程',
  'settings.session-mode.trade-gate.start-node': '起始问题',
  'settings.session-mode.trade-gate.simulation.show': '模拟',
  'settings.session-mode.trade-gate.simulation.unavailable':
    '请先将起始问题连接到至少一个完整结果，再开始模拟。',
  'settings.session-mode.trade-gate.add-question': '添加问题',
  'settings.session-mode.trade-gate.question': '问题',
  'settings.session-mode.trade-gate.new-question-title': '新问题',
  'settings.session-mode.trade-gate.question-title': '问题标题',
  'settings.session-mode.trade-gate.prompt': '提示',
  'settings.session-mode.trade-gate.options': '选项',
  'settings.session-mode.trade-gate.option': '选项',
  'settings.session-mode.trade-gate.option-label': '选项标签',
  'settings.session-mode.trade-gate.option-target': '指向',
  'settings.session-mode.trade-gate.flow-map': '流程图',
  'settings.session-mode.trade-gate.flow-fit': '适合',
  'settings.session-mode.trade-gate.flow-click-hint':
    '点击节点或路径标签进行编辑。',
  'settings.session-mode.trade-gate.flow-truncated':
    '此流程过大，无法完整显示。部分重复分支已隐藏。',
  'settings.session-mode.trade-gate.no-questions':
    '添加第一个问题以开始此流程。',
  'home.quick-links.setups': '交易设置',
  'setups.view.action.compare-selected': '比较已选设置',
  'setups.view.action.create': '创建设置',
  'setups.view.action.new': '新建设置',

  'setups.view.action.retry': '重试',

  'setups.view.card.select-for-compare': '选择设置进行比较',
  'setups.view.card.sparkline-aria': '设置迷你趋势图',

  'setups.view.compare.confidence': '置信度',
  'setups.view.compare.confidence.high': '高',
  'setups.view.compare.confidence.low': '低',
  'setups.view.compare.confidence.moderate': '中等',
  'setups.view.compare.cumulative-empty': '所选设置没有累计交易数据。',
  'setups.view.compare.cumulative-privacy': '隐私模式开启时将隐藏累计绩效。',
  'setups.view.compare.cumulative-title': '累计绩效',
  'setups.view.compare.edge-column': '优势',

  'setups.view.compare.edge-label': '胜出者',
  'setups.view.compare.edge-reasons-privacy': '隐私模式开启时将隐藏优势详情。',
  'setups.view.compare.edge-strength.clear': '明显优势',
  'setups.view.compare.edge-strength.slight': '轻微优势',
  'setups.view.compare.edge-strength.strong': '强劲优势',
  'setups.view.compare.empty': '请选择两个设置进行比较。',
  'setups.view.compare.expectancy-edge': '期望值优势',
  'setups.view.compare.metric': '指标',
  'setups.view.compare.metrics-title': '比较指标',
  'setups.view.compare.no-clear-edge': '没有明显优势',

  'setups.view.compare.reason.higher.expectancy': '期望值更高',
  'setups.view.compare.reason.higher.net-pnl': '净盈亏更高',
  'setups.view.compare.reason.higher.profit-factor': '利润因子更高',
  'setups.view.compare.reason.higher.win-rate': '胜率更高',
  'setups.view.compare.reason.lower.expectancy': '期望值更低',
  'setups.view.compare.reason.lower.net-pnl': '净盈亏更低',
  'setups.view.compare.reason.lower.profit-factor': '利润因子更低',
  'setups.view.compare.reason.lower.win-rate': '胜率更低',
  'setups.view.compare.reason.similar.expectancy': '期望值相近',
  'setups.view.compare.reason.similar.net-pnl': '净盈亏相近',
  'setups.view.compare.reason.similar.profit-factor': '利润因子相近',
  'setups.view.compare.reason.similar.win-rate': '胜率相近',
  'setups.view.compare.sample': '样本',

  'setups.view.compare.title': '比较设置',
  'setups.view.completeness.incomplete-playbook': '交易计划不完整',
  'setups.view.completeness.no-linked-notes': '没有关联笔记',
  'setups.view.completeness.no-rules': '没有规则',

  'setups.view.date.never': '从未',
  'setups.view.date.today': '今天',
  'setups.view.date.yesterday': '昨天',

  'setups.view.detail.action.edit': '编辑设置',
  'setups.view.detail.action.view-trades': '在交易日志中查看',
  'setups.view.detail.back': '返回',
  'setups.view.detail.brief.direction.both': '双向',
  'setups.view.detail.brief.direction.long': '做多',
  'setups.view.detail.brief.direction.short': '做空',
  'setups.view.detail.brief.health': '设置健康度',
  'setups.view.detail.brief.health.notes': '笔记',
  'setups.view.detail.brief.health.playbook': '交易计划',
  'setups.view.detail.brief.health.rules': '规则',
  'setups.view.detail.brief.health.screenshots': '截图',
  'setups.view.detail.brief.health.trades': '交易',

  'setups.view.detail.brief.linked-notes-modal.title': '关联笔记',
  'setups.view.detail.brief.profile': '概况',
  'setups.view.detail.brief.profile.direction': '方向',
  'setups.view.detail.brief.profile.sessions': '交易时段',
  'setups.view.detail.brief.profile.tickers': '交易代码',
  'setups.view.detail.brief.profile.timeframes': '时间周期',
  'setups.view.detail.brief.status.complete': '完整',
  'setups.view.detail.brief.status.missing': '缺失',
  'setups.view.detail.brief.view-all': '查看全部',

  'setups.view.detail.no-linked-notes': '尚无关联笔记。',

  'setups.view.detail.performance.cumulative-pnl': '累计盈亏',
  'setups.view.detail.performance.cumulative-r': '累计 R',
  'setups.view.detail.performance.empty': '尚无关联交易。',

  'setups.view.detail.playbook': '交易计划',

  'setups.view.detail.rule.required': '必需',
  'setups.view.detail.rules': '规则',

  'setups.view.empty.no-setups': '尚无设置。创建第一个设置以开始跟踪交易计划。',
  'setups.view.error.load-failed': '无法加载设置数据。',
  'setups.view.error.title': '无法加载设置',

  'setups.view.metric.expectancy-r': '期望值 (R)',
  'setups.view.metric.expected-value': '期望值',

  'setups.view.metric.last-traded': '最近交易',
  'setups.view.metric.net-pnl': '总盈亏',
  'setups.view.metric.profit-factor': '利润因子',
  'setups.view.metric.total-pnl': '总盈亏',
  'setups.view.metric.trade-count': '交易次数',
  'setups.view.metric.trades': '笔交易',
  'setups.view.metric.win-rate': '胜率',
  'setups.view.ranking.empty': '尚无设置绩效数据。',
  'setups.view.ranking.metric-aria': '绩效指标',
  'setups.view.ranking.privacy': '隐私模式开启时将隐藏绩效数值。',

  'setups.view.status.active': '活跃',

  'setups.view.status.archived': '已归档',

  'setups.view.status.testing': '测试中',

  'setups.view.summary.aria': '设置概览摘要',

  'setups.view.summary.best-performer': '最佳表现',

  'setups.view.summary.needs-review': '需要复盘',

  'setups.view.tab.compare': '比较',
  'setups.view.tab.overview': '概览',
  'setups.view.tabs.aria': '设置视图标签页',
  'setups.view.title': '设置',
  'validation.setup-resolution-failed': '无法解析设置。',
  'filter.modal.image.annotation-status': '注释状态',
  'filter.modal.image.status.tagged': '有标签',
  'filter.modal.image.status.untagged': '无标签',
  'filter.modal.image.status.has-notes': '有备注',
  'filter.modal.image.status.no-notes': '无备注',
  'filter.modal.image.tags': '媒体标签',
  'setups.view.detail.action.gallery': '打开图库',
  'tradelog.mode.label': '交易日志模式',
  'tradelog.mode.trades': '交易',
  'tradelog.mode.image-gallery': '图库',

  'imageGallery.empty.error.title': '图库不可用',
  'imageGallery.empty.no-images.title': '还没有媒体',
  'imageGallery.empty.no-images.description':
    '附加到交易或复盘笔记的图片、GIF、视频和 YouTube 链接会自动显示在这里。',
  'imageGallery.empty.no-results.title': '没有媒体匹配这些筛选条件',
  'imageGallery.empty.no-results.description':
    '尝试清除当前筛选或扩大日期范围，以显示更多图库项目。',
  'imageGallery.empty.no-source.title': '此来源没有媒体',
  'imageGallery.empty.no-source.description':
    '此来源还没有图库条目。切换回所有媒体或选择其他来源。',
  'imageGallery.empty.action.clear-filters': '清除筛选',
  'imageGallery.empty.action.show-all': '显示所有媒体',
  'imageGallery.error.load-failed': '无法加载图库。',

  'imageGallery.open-source': '打开笔记',
  'imageGallery.image-alt': '{date} 的 {source} 媒体',
  'imageGallery.privacy-blurred': '为保护隐私已模糊',

  'imageGallery.sort.label': '排序：',
  'imageGallery.sort.newest': '最新',
  'imageGallery.sort.oldest': '最旧',
  'imageGallery.sort.best': '最佳 P&L',
  'imageGallery.sort.worst': '最差 P&L',
  'imageGallery.size-aria': '图库媒体大小',
  'imageGallery.size.small': '小',
  'imageGallery.size.medium': '中',
  'imageGallery.size.large': '大',
  'imageGallery.view-mode-aria': '图库卡片分组',
  'imageGallery.view-mode.grouped': '分组',
  'imageGallery.view-mode.individual': '单独',
  'imageGallery.group.additional-media': '{count} 个其他媒体项目',
  'imageGallery.group.annotation-summary':
    '{total} 个媒体项目中有 {annotated} 个已添加标注',
  'imageGallery.group.navigation':
    '媒体 {mediaCurrent}/{mediaTotal} · 条目 {groupCurrent}/{groupTotal}',
  'imageGallery.source.label': '来源：',
  'imageGallery.source.all': '所有媒体',
  'imageGallery.source.trade': '交易',
  'imageGallery.source.folder': '文件夹',
  'imageGallery.source.reviews': '复盘',
  'imageGallery.source.drc': '每日复盘',
  'imageGallery.source.weekly': '每周复盘',
  'imageGallery.source.monthly': '每月复盘',
  'imageGallery.source.quarterly': '季度复盘',
  'imageGallery.source.yearly': '年度复盘',

  'imageGallery.annotation.reviewed': '已复盘',
  'imageGallery.annotation.unreviewed': '未复盘',
  'imageGallery.date.unknown': '未知日期',
  'imageGallery.annotation.tag': '标签',

  'imageGallery.annotation.editor-title': '标注媒体',
  'imageGallery.annotation.editor-title-with-file': '标注 {fileName}',
  'imageGallery.annotation.tags': '标签',
  'imageGallery.annotation.tags-placeholder': '突破、A+ 设置、错误',
  'imageGallery.annotation.notes': '备注',
  'imageGallery.annotation.notes-placeholder': '未来的你应该从这张图学到什么？',
  'imageGallery.annotation.error.save-failed': '无法保存媒体标注。',
  'imageGallery.annotation.error.load-failed': '无法加载媒体标注。',
  'imageGallery.annotation.saving': '正在保存...',
  'settings.gallery-folders.section': '媒体图库',
  'settings.gallery-folders.description':
    '在交易日志图库中显示这些文件夹里的媒体。',
  'settings.gallery-folders.placeholder': '选择文件夹...',
  'settings.gallery-folders.add': '添加',
  'settings.gallery-folders.remove-aria': '移除图库文件夹 {path}',
  'settings.gallery-folders.not-a-folder': '请选择文件夹，而不是媒体文件。',
  'settings.gallery-folders.save-failed': '无法保存图库文件夹。请重试。',
  'tradelog.guide.switch-to-gallery.title': '从交易切换到图库',
  'tradelog.guide.switch-to-gallery.description':
    '使用此模式选择器在常规交易日志和图库之间切换。点击图库，继续查看你的图片、GIF、视频和 YouTube 链接导览。',

  'tradelog.guide.gallery-grouping.title': '按日志条目分组媒体',
  'tradelog.guide.gallery-grouping.description':
    '分组模式会将每笔交易或每篇复盘保留在一张卡片中。单独模式会将每个附加媒体项目显示为一张独立卡片。',
  'tradelog.guide.gallery-source-sort.title': '选择媒体来源和顺序',
  'tradelog.guide.gallery-source-sort.description':
    '使用来源聚焦所有媒体、交易附件或复盘笔记媒体。使用排序优先查看最新、最旧、最佳或最差的交易。',
  'tradelog.guide.gallery-size.title': '调整图库预览大小',
  'tradelog.guide.gallery-size.description':
    '使用这些尺寸按钮在紧凑浏览和更大的图表预览之间切换，同时不裁剪重要图表细节。',
  'tradelog.guide.gallery-filters.title': '用同一个入口筛选图库',
  'tradelog.guide.gallery-filters.description':
    '筛选菜单在这里的用法相同。在图库模式下，它还包含一个“图库”分区，提供注释状态和媒体标签等媒体筛选。',
  'tradelog.guide.gallery-grid.title': '打开媒体进行细看',
  'tradelog.guide.gallery-grid.description':
    '每张卡片都会保持内容无遮挡，同时显示简洁的交易和复盘上下文。点击任意卡片，或按下一步以全屏打开第一个可见项目。',
  'tradelog.guide.gallery-fullscreen-actions.title': '在全屏中标注媒体',
  'tradelog.guide.gallery-fullscreen-actions.description':
    '内容足够大时，使用标签添加媒体级标签和备注。打开笔记会带你回到来源交易或复盘笔记。',
  'tradelog.guide.gallery-open-annotation.title': '打开注释面板',
  'tradelog.guide.gallery-open-annotation.description':
    '点击标签来标注这个特定媒体。媒体标签和备注描述的是附件，而不是整笔交易。',
  'tradelog.guide.gallery-annotation-panel.title': '添加媒体标签和笔记',
  'tradelog.guide.gallery-annotation-panel.description':
    '使用媒体标签记录图表特定想法，例如流动性扫荡或假突破；使用备注记录你想记住的市场结构背景。',
  'tradelog.guide.gallery-finish.title': '你已经了解交易日志的两种模式',
  'tradelog.guide.gallery-finish.description':
    '需要表格和批量工具时使用交易。想在整个日志中复盘图片、GIF、视频、YouTube 链接和图表标注时使用图库。',
  'filter.menu.whats-new.open.title': '筛选有了新菜单',
  'filter.menu.whats-new.open.description':
    '所有筛选现在都在一个分层菜单中，并新增了两种缩小交易范围的方式。打开它看看。',
  'filter.menu.whats-new.exclude.title': '排除不想要的内容',
  'filter.menu.whats-new.exclude.description':
    '每个值都有一个 ⊘ 按钮。排除某个值后，所有带有该值的交易都会被去掉，无论它还匹配什么。',
  'filter.menu.whats-new.match.title': '选择多个值如何匹配',
  'filter.menu.whats-new.match.description':
    '选中多个值时，决定交易需要满足“任意一项”、“全部”、“仅这些”还是“完全一致”。标签、交易设置、错误和自定义字段都有这个匹配选项。',
  'filter.menu.whats-new.phases.title': '按挑战阶段筛选',
  'filter.menu.whats-new.phases.description':
    '拥有多个阶段的自营账户会打开其阶段列表。可以只选某些阶段，而不是整个账户。',
  'filter.menu.whats-new.done.title': '这就是筛选的新功能',
  'filter.menu.whats-new.done.description':
    '同一个菜单也用于交易日志、仪表板、首页、交易设置和复盘中。点击后立即生效。',
  'tradelog.guide.image-gallery-empty.intro.title': '还没有媒体',
  'tradelog.guide.image-gallery-empty.intro.description':
    '把图片、GIF、视频或 YouTube 链接添加到交易或复盘笔记后，它们会自动出现在这里。有媒体后，Journalit 会显示完整图库导览，包括全屏复盘、标签和备注。',

  'filter.modal.section.image-gallery': '图库',
  'filter.modal.session-tags.placeholder': '会话标签',
  'filter.modal.session-tags.none-found': '未找到会话标签',
  'account.prop-challenge.title': '交易考核挑战',
  'account.prop-challenge.identity': '挑战信息',
  'account.prop-challenge.prefill.heading-link': '从你的商号预填',
  'account.prop-challenge.prefill.updates-link': '保持机构规则最新',
  'account.prop-challenge.prefill.updates-link-firm': '保持 {firm} 规则最新',
  'account.prop-challenge.prefill.phase-link': '使用 PRO 预填规则',
  'account.prop-challenge.prefill.phase-link-firm':
    '使用 PRO 预填 {firm} 的规则',
  'account.prop-challenge.prefill.heading-link-firms':
    '{firms} 等 +{count} 家，PRO 自动填入规则',
  'account.prop-challenge.prefill.heading-link-firms-all':
    '{firms}，PRO 自动填入规则',
  'account.prop-challenge.prefill.match':
    '我们有 {firm}：{count} 个挑战，规则已就绪',
  'account.prop-challenge.rules.empty':
    '尚未添加规则。使用“添加规则”来定义此阶段。',
  'account.prop-challenge.rules': '规则',
  'account.prop-challenge.costs.empty': '尚未添加费用。',
  'account.prop-challenge.description':
    '跟踪此账户完成多阶段交易公司考核挑战。',
  'account.prop-challenge.enable': '启用挑战跟踪',
  'account.prop-challenge.challenge-name': '挑战名称',
  'account.prop-challenge.challenge-name-placeholder': '例如：25K 评估',
  'account.prop-challenge.firm-name': '公司名称（可选）',
  'account.prop-challenge.firm-name-placeholder': '例如：Apex Trader Funding',
  'account.prop-challenge.profile.title': '应用机构规则',
  'account.prop-challenge.profile.firm': '公司',
  'account.prop-challenge.profile.challenge': '挑战',
  'account.prop-challenge.profile.choose-firm': '选择公司',
  'account.prop-challenge.profile.choose-challenge': '选择挑战',
  'account.prop-challenge.profile.custom-firm': '其他 / 自定义公司',
  'account.prop-challenge.profile.help':
    '选择你的机构和计划以填入其规则：回撤、目标、出金。之后可以编辑。',
  'account.prop-challenge.profile.current': '当前：{identity}',
  'account.prop-challenge.profile.apply': '应用',
  'account.prop-challenge.profile.loading': '正在加载机构规则…',
  'account.prop-challenge.profile.refreshing': '正在检查规则更新…',
  'account.prop-challenge.profile.unavailable': '离线时无法获取机构规则。',

  'account.prop-challenge.profile.confirm-title': '替换挑战设置？',
  'account.prop-challenge.profile.confirm-message':
    '应用这些机构规则将替换当前设置的阶段和规则。',
  'account.prop-challenge.current-phase': '当前阶段',
  'account.prop-challenge.phase-rules': '{phase}规则',
  'account.prop-challenge.next-phase': '下一阶段：{phase}',
  'account.prop-challenge.view-phase': '查看阶段',
  'account.prop-challenge.unnamed-phase': '未命名阶段',
  'account.prop-challenge.phase-name': '阶段名称',
  'account.prop-challenge.phase-type': '阶段类型',
  'account.prop-challenge.phase-type.evaluation': '考核',
  'account.prop-challenge.phase-type.verification': '验证',
  'account.prop-challenge.phase-type.sim_funded': '模拟资助',
  'account.prop-challenge.phase-type.live_funded': '实盘资助',
  'account.prop-challenge.phase-type.custom': '自定义',
  'account.prop-challenge.starting-balance': '起始余额',
  'account.prop-challenge.broker-account-id': '经纪账户',
  'account.prop-challenge.broker-accounts.assigned': '已分配给 {phase}',
  'account.prop-challenge.broker-accounts.trades': '{count} 笔交易',
  'account.prop-challenge.broker-accounts.trade-one': '1 笔交易',
  'account.prop-challenge.phase-started': '开始时间',
  'account.prop-challenge.phase-completed': '结束时间',
  'account.prop-challenge.timeline.completed-before-started':
    '{phase} 的结束时间必须不早于开始时间。',
  'account.prop-challenge.timeline.out-of-order':
    '{phase} 必须在 {next} 开始时或之前结束。',
  'account.prop-challenge.timeline.policy-history-conflict':
    '{phase} 的开始时间晚于后续规则变更。请将开始时间前移。',
  'account.prop-challenge.default-phase-name': '阶段 {number}',
  'account.prop-challenge.add-phase': '添加阶段',
  'account.prop-challenge.remove-phase': '删除阶段',
  'account.prop-challenge.add-rule': '添加规则',
  'account.prop-challenge.rule.enabled': '规则已启用',
  'account.prop-challenge.rule.amount': '金额',
  'account.prop-challenge.rule.target-type': '目标类型',
  'account.prop-challenge.rule.credit-withdrawals': '将提款计入目标',
  'account.prop-challenge.rule.drawdown-mode': '回撤模式',
  'account.prop-challenge.rule.lock-at-balance': '锁定余额',
  'account.prop-challenge.rule.daily-loss-model': 'Daily loss amount',
  'account.prop-challenge.rule.daily-loss-model.fixed': 'Fixed amount',
  'account.prop-challenge.rule.daily-loss-model.threshold':
    'Increases at account profit threshold',
  'account.prop-challenge.rule.daily-loss-model.peak-eod-profit':
    '按最高日终利润调整',
  'account.prop-challenge.rule.daily-loss-peak-eod-help':
    '在账户以激活余额收盘前使用固定限额。从下一交易日起，限额按最高日终账户利润的设定百分比计算，且不会下降。',
  'account.prop-challenge.rule.scale-at-balance': '激活余额',
  'account.prop-challenge.rule.scaled-percent-of-peak-eod-profit':
    '用作限额的最高日终利润比例 (%)',
  'account.prop-challenge.rule.peak-eod-profit-percent-summary':
    '最高日终利润的 {value}',
  'account.prop-challenge.rule.daily-loss-tiered-summary':
    '按上一交易日收盘余额分级',
  'account.prop-challenge.rule.daily-loss-model.profit-tiers':
    '上一交易日收盘利润分级',
  'account.prop-challenge.rule.daily-loss-tiers-help':
    '使用“利润:亏损限额”组合。根据上一交易日收盘账户利润确定下一交易时段的限额。',
  'account.prop-challenge.rule.loss-tiers': '利润层级与亏损限额',
  'account.prop-challenge.rule.daily-loss-threshold-help':
    'The higher daily loss amount activates permanently when lifetime account profit first reaches the configured percentage of starting balance.',
  'account.prop-challenge.rule.profit-threshold-percent':
    'Account profit threshold (%)',
  'account.prop-challenge.rule.amount-after-threshold':
    'Daily loss amount after threshold',
  'account.prop-challenge.rule.breach-action': '触及限额时的处理',
  'account.prop-challenge.rule.breach-action.hard': '判定账户失败',
  'account.prop-challenge.rule.breach-action.soft': '暂停至下一交易时段',
  'account.prop-challenge.rule.days': '交易天数',
  'account.prop-challenge.rule.minimum-daily-profit': '每日最低利润',
  'account.prop-challenge.rule.minimum-daily-profit-summary': '每日 {value}+',
  'account.prop-challenge.rule.best-day-percent': '最佳日最高占比（%）',
  'account.prop-challenge.rule.position-limit-model': 'Position limit model',
  'account.prop-challenge.rule.position-limit-model.fixed': 'Fixed limit',
  'account.prop-challenge.rule.position-limit-model.eod-profit-tiers':
    'EOD profit tiers',
  'account.prop-challenge.rule.position-profit-basis': '仓位扩展利润基准',
  'account.prop-challenge.rule.position-profit-basis.cumulative':
    '累计交易利润（出金不会降低）',
  'account.prop-challenge.rule.position-profit-basis.current-account':
    '当前账户利润（出金会降低）',
  'account.prop-challenge.rule.position-limit-model.eod-profit':
    'Scales with EOD profit',
  'account.prop-challenge.rule.position-tiers': 'Profit tiers',
  'account.prop-challenge.rule.position-tiers-help':
    'Enter each completed EOD profit threshold and its new contract limit as profit:contracts, separated by commas. A tier applies from the next trading day.',
  'account.prop-challenge.rule.position-scaling-help':
    'Each completed profit step adds one contract starting on the next trading day, up to the maximum.',
  'account.prop-challenge.rule.initial-contracts': 'Initial contracts',
  'account.prop-challenge.rule.profit-per-contract':
    'EOD profit per additional contract',
  'account.prop-challenge.rule.maximum-contracts':
    'Maximum contracts after scaling',
  'account.prop-challenge.rule.micros-per-contract': '10 手微型合约计为 1 手',
  'account.prop-challenge.rule.micros-per-contract-help':
    '如果你的公司在此限额中将微型期货（MES、MNQ、MGC 等）计为标准合约的十分之一，请开启。如果每手微型合约都按完整合约计算，请保持关闭。',
  'account.prop-challenge.rule.max-contracts': '最大合约数',
  'account.prop-challenge.rule.profit_target': '盈利目标',
  'account.prop-challenge.rule.drawdown': '回撤',
  'account.prop-challenge.rule.daily_loss_limit': '每日亏损限额',
  'account.prop-challenge.rule.live_review_daily_profit': '实盘审核单日盈利',
  'account.prop-challenge.rule.best-profitable-day': '单日盈利触发值',
  'account.prop-challenge.rule.daily_profit_cap': '每日计入利润上限',
  'account.prop-challenge.rule.per-trading-day': '每个交易日',
  'account.prop-challenge.rule.minimum_trading_days': '最少交易天数',
  'account.prop-challenge.rule.minimum_profitable_days': '最少盈利天数',
  'account.prop-challenge.rule.consistency-cushion-percent':
    '一致性缓冲（百分点）',
  'account.prop-challenge.rule.consistency-cushion-short': '缓冲',
  'account.prop-challenge.rule.consistency': '一致性',
  'account.prop-challenge.rule.max_position_size': '最大持仓规模',
  'account.prop-challenge.drawdown.static': '固定',
  'account.prop-challenge.drawdown.eod-trailing': '日终跟踪',
  'account.prop-challenge.drawdown.intraday-trailing': '日内跟踪',
  'account.prop-challenge.summary.status.active': '进行中',
  'account.prop-challenge.summary.status.passed': '已通过',
  'account.prop-challenge.summary.status.failed': '未通过',
  'account.prop-challenge.summary.status.pending': '待开始',
  'account.prop-challenge.summary.status.warning': '接近限额',
  'account.prop-challenge.summary.phase-status.pending': '待开始',
  'account.prop-challenge.summary.phase-status.active': '进行中',
  'account.prop-challenge.summary.phase-status.passed': '已通过',
  'account.prop-challenge.summary.phase-status.failed': '未通过',
  'account.prop-challenge.summary.rule.profit_target': '盈利目标',
  'account.prop-challenge.summary.rule.drawdown': '回撤',
  'account.prop-challenge.summary.rule.drawdown-static': '静态回撤',
  'account.prop-challenge.summary.rule.drawdown-eod_trailing': '日终回撤',
  'account.prop-challenge.summary.rule.drawdown-intraday_trailing': '日内回撤',
  'account.prop-challenge.summary.rule.daily_loss_limit': '单日亏损',
  'account.prop-challenge.summary.rule.live_review_daily_profit': '实盘审核',
  'account.prop-challenge.summary.rule.daily_profit_cap': '每日计入利润',
  'account.prop-challenge.summary.rule.minimum_trading_days': '交易天数',
  'account.prop-challenge.summary.rule.minimum_profitable_days': '盈利天数',
  'account.prop-challenge.summary.rule.consistency': '最佳日一致性',
  'account.prop-challenge.summary.rule.max_position_size': '持仓规模',
  'account.prop-challenge.ledger.value.of': '{current} / {target}',
  'account.prop-challenge.ledger.section.payout': '出金条件',
  'account.prop-challenge.ledger.requirement.minimum': '下限 {value}',
  'account.prop-challenge.ledger.requirement.maximum': '上限 {value}',
  'account.prop-challenge.ledger.value.ratio': '{current} / {target}',
  'account.prop-challenge.payout.met-of-total': '已满足 {met} / {total} 项条件',
  'account.prop-challenge.ledger.value.of-today': '今日 {current} / {target}',
  'account.prop-challenge.ledger.value.credited-profit':
    '实际利润 {actual} 中计入 {credited}',
  'account.prop-challenge.ledger.value.used': '已用 {used}',
  'account.prop-challenge.ledger.value.consistency-goal':
    '一致性目标 {current} / {target}',
  'account.prop-challenge.ledger.value.best-day-share': '最佳日占利润 {value}',
  'account.prop-challenge.ledger.value.no-profit': '尚无利润',
  'account.prop-challenge.ledger.requirement.best-day':
    '最佳日 ≤ 总利润的 {value}',
  'account.prop-challenge.ledger.state.needs-profit': '需要利润',
  'account.prop-challenge.ledger.tooltip.open': '说明{rule}',
  'account.prop-challenge.ledger.tooltip.consistency.description':
    '限制阶段总利润中来自单个最赚钱交易日的比例。',
  'account.prop-challenge.ledger.tooltip.consistency.formula':
    '最佳日利润 ÷ 阶段总利润 × 100',
  'account.prop-challenge.ledger.tooltip.consistency.best-day':
    '最佳日：{value}',
  'account.prop-challenge.ledger.tooltip.consistency.total-profit':
    '总利润：{value}',
  'account.prop-challenge.ledger.tooltip.consistency.share':
    '{best} ÷ {total} × 100 = {share}',
  'account.prop-challenge.ledger.tooltip.consistency.goal':
    '一致性目标：{best} ÷ {maximum} = {goal}',
  'account.prop-challenge.ledger.tooltip.consistency.goal-hint':
    '在其他交易日累积利润会降低该比例，但出现更大的最佳日会抬高目标。',
  'account.prop-challenge.ledger.tooltip.consistency.within':
    '{share} ≤ {maximum}——符合规则',
  'account.prop-challenge.ledger.tooltip.consistency.pending':
    '阶段总利润转正后才开始计算。',
  'account.prop-challenge.ledger.tooltip.consistency.no-maximum':
    '一致性目标需要大于 0% 的最大值。',
  'account.prop-challenge.ledger.help.open': '关于{rule}',
  'account.prop-challenge.ledger.help.profit_target':
    '把账户增加这个金额以通过该阶段。只计算已平仓交易。',
  'account.prop-challenge.ledger.help.profit_target.example':
    '此账户需要 {target} 利润：目前 {current}，还差 {remaining}。',
  'account.prop-challenge.ledger.help.profit_target.example-done':
    '已达目标：{current} / {target}。',
  'account.prop-challenge.ledger.help.drawdown.static':
    '余额相对起始余额最多可下跌的幅度。下限不会移动。',
  'account.prop-challenge.ledger.help.drawdown.static.example':
    '此账户下限为 {floor}；余额必须保持在其上方。限额 {limit} 还剩 {buffer}。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing':
    '下限跟随你最高的日终余额，只会上升，直到锁定在公司的锁定水平。',
  'account.prop-challenge.ledger.help.drawdown.eod_trailing.example':
    '当前下限为 {floor}（最高收盘减去 {limit}），并随更高收盘上移。还剩 {buffer}。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing':
    '底线随时跟踪你的最高余额，包括浮动盈利。Journalit 只看到已平仓交易，因此这里的底线跟踪每次平仓后的最佳余额；持仓期间达到的峰值不会计入。请以公司的数据为准。',
  'account.prop-challenge.ledger.help.drawdown.intraday_trailing.example':
    '当前下限为 {floor}（平仓后最佳余额减去 {limit}）。还剩 {buffer}；公司实时数字可能更紧。',
  'account.prop-challenge.ledger.help.daily_loss_limit':
    '单个交易日最多可亏损的金额。触及后会判定阶段失败，或暂停至下一交易时段，视公司而定。',
  'account.prop-challenge.ledger.help.daily_loss_limit.example':
    '今日：日亏损限额 {limit} 已用 {used}，还剩 {left}。',
  'account.prop-challenge.ledger.help.daily_profit_cap':
    '每日利润只有一部分计入目标。超过上限的利润会保留，但不计入。',
  'account.prop-challenge.ledger.help.daily_profit_cap.example':
    '一天利润只计入 {cap}；超过上限已赚的 {excluded} 不计入。',
  'account.prop-challenge.ledger.help.live_review_daily_profit':
    '任意一个交易日达到或超过该利润，账户即有资格接受实盘审核。',
  'account.prop-challenge.ledger.help.live_review_daily_profit.example':
    '有一天达到 {trigger} 或以上即合格；目前最佳日 {bestDay}。',
  'account.prop-challenge.ledger.help.minimum_trading_days':
    '至少有一笔已平仓交易的天数。无论多快达到目标，未满该天数都不能通过阶段。',
  'account.prop-challenge.ledger.help.minimum_trading_days.example':
    '已完成 {current} / {target} 个交易日，还差 {remaining}。',
  'account.prop-challenge.ledger.help.minimum_profitable_days':
    '收盘利润达到或超过公司最低日利润的交易日。打平或更小的盈利不计。',
  'account.prop-challenge.ledger.help.minimum_profitable_days.example':
    '已有 {current} / {target} 天收盘达到 {minimum} 或以上，还差 {remaining}。',
  'account.prop-challenge.ledger.help.consistency':
    '单日最佳利润不得超过阶段总利润的该比例。应靠其他日子多赚来修复，而不是靠亏损。',
  'account.prop-challenge.ledger.help.consistency.example':
    '最佳日 {bestDay} 占总利润 {total} 的 {share}；总利润需达到 {goal} 才能落在 {maximum}。',
  'account.prop-challenge.ledger.help.consistency.example-done':
    '最佳日 {bestDay} 占总利润的 {share}，在 {maximum} 限额内。',
  'account.prop-challenge.ledger.help.consistency.example-none':
    '尚无利润，因此没有可比较的最佳日。',
  'account.prop-challenge.ledger.help.max_position_size':
    '单个持仓允许的最大合约数。Journalit 会检查每笔交易的规模。部分机构会随着盈利增加而提高上限。',
  'account.prop-challenge.ledger.help.max_position_size.example':
    '当前每笔交易最多 {maximum} 张合约；目前最大一笔为 {current}。',
  'account.prop-challenge.ledger.help.payout.cycle_days':
    '当前出金周期内的交易日。批准出金后重新计数。',
  'account.prop-challenge.ledger.help.payout.cycle_days.example':
    '本周期交易日 {current} / {target}，还差 {remaining}。',
  'account.prop-challenge.ledger.help.payout.qualifying_days':
    '本周期内收盘利润达到或超过公司最低日利润的交易日。',
  'account.prop-challenge.ledger.help.payout.qualifying_days.example':
    '本周期达到 {minimum} 或以上的天数 {current} / {target}，还差 {remaining}。',
  'account.prop-challenge.ledger.help.payout.cycle_profit':
    '自周期开始以来的利润必须达到该金额才能申请。',
  'account.prop-challenge.ledger.help.payout.cycle_profit.example':
    '本周期已赚 {current}，需要 {target}。',
  'account.prop-challenge.ledger.help.payout.minimum_balance':
    '申请时余额必须达到或高于该水平。',
  'account.prop-challenge.ledger.help.payout.minimum_balance.example':
    '余额 {current}；必须至少 {target}。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit':
    '首次出金之后，每个新周期必须先盈利才能再次申请。',
  'account.prop-challenge.ledger.help.payout.positive_cycle_profit.example':
    '周期利润为 {current}；必须大于零。',
  'account.prop-challenge.ledger.help.payout.consistency':
    '最佳日不得超过周期利润的该比例。',
  'account.prop-challenge.ledger.help.payout.consistency.example':
    '最佳单日 {bestDay} 占周期利润 {total} 的 {share}；周期利润需达到 {goal}，该比例才会落在 {maximum}。',
  'account.prop-challenge.ledger.help.payout.consistency.example-done':
    '最佳单日 {bestDay} 占周期利润的 {share}，在 {maximum} 限制以内。',
  'account.prop-challenge.ledger.help.payout.consistency.example-none':
    '周期尚无利润，因此没有可比较的最佳单日。',
  'account.prop-challenge.ledger.help.payout.minimum_request':
    '公司接受的最小出金。可用金额必须先达到该值。',
  'account.prop-challenge.ledger.help.payout.minimum_request.example':
    '可用 {current}；公司最低申请额为 {target}。',
  'account.prop-challenge.ledger.help.payout.payout_count':
    '本阶段允许的出金次数。用完额度即完成该阶段。',
  'account.prop-challenge.ledger.help.payout.payout_count.example':
    '本阶段已用 {current} / {target} 次出金。',
  'account.prop-challenge.ledger.help.payout.request_window':
    '只在这些工作日、按公司时区接受申请。',
  'account.prop-challenge.ledger.help.payout.request_window.example':
    '今天是 {today}；申请开放日为 {days}（{timeZone}）。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours':
    '自本周期第一笔交易起的时间必须达到该值才能申请。',
  'account.prop-challenge.ledger.help.payout.elapsed_hours.example':
    '自周期首笔交易起已过 {current} / {target} 小时。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days':
    '整个有资阶段的合格天数，不只是本周期。达到后解锁出金。',
  'account.prop-challenge.ledger.help.payout.lifetime_qualifying_days.example':
    '整个阶段合格日 {current} / {target}。',
  'account.prop-challenge.ledger.requirement.target': '目标 {value}',
  'account.prop-challenge.ledger.requirement.buffer': '缓冲 {value}',
  'account.prop-challenge.ledger.requirement.max': '上限 {value}',
  'account.prop-challenge.ledger.requirement.daily-cap':
    '每个交易日最多计入 {value}',
  'account.prop-challenge.ledger.requirement.profitable-days':
    '{days} 天达到 {profit}+',
  'account.prop-challenge.ledger.requirement.days': '{value} 天',
  'account.prop-challenge.ledger.requirement.at-most': '≤ {value}',
  'account.prop-challenge.ledger.state.not-started': '未开始',
  'account.prop-challenge.ledger.state.in-progress': '进行中',
  'account.prop-challenge.ledger.state.reached': '已达成',
  'account.prop-challenge.ledger.state.met': '已满足',
  'account.prop-challenge.ledger.state.eligible': '符合资格',
  'account.prop-challenge.ledger.state.safe': '安全',
  'account.prop-challenge.ledger.state.clear': '未触及',
  'account.prop-challenge.ledger.state.within-rule': '符合规则',
  'account.prop-challenge.ledger.state.near-limit': '接近上限',
  'account.prop-challenge.ledger.state.limit-reached': '已触及限额',
  'account.prop-challenge.ledger.state.cap-applied': '已应用上限',
  'account.prop-challenge.ledger.state.within-cap': '未超过上限',
  'account.prop-challenge.ledger.state.breached': '已违规',
  'account-dashboard.prop.metrics.total': '挑战',
  'account-dashboard.prop.metrics.pass-rate': '通过率',
  'account-dashboard.prop.metrics.costs': '挑战成本',
  'account-dashboard.prop.metrics.payouts': '出金',
  'account-dashboard.prop.metrics.net': '净额',
  'account-dashboard.prop.tabs.overview': '概览',
  'account-dashboard.mode.selector': '账户仪表盘模式',
  'account-dashboard.mode.account-overview': '概览',
  'account-dashboard.mode.challenges': '挑战',
  'account-dashboard.prop.metrics.active': '进行中的挑战',
  'account-dashboard.prop.economics.title': '成本效益',
  'account-dashboard.prop.economics.roi': '投资回报率',
  'account-dashboard.prop.economics.roi-no-cost': '无成本',
  'account-dashboard.prop.economics.average-cost-per-attempt':
    '每次尝试平均成本',
  'account-dashboard.prop.economics.cost-per-funded-account':
    '每个资助账户成本',
  'account-dashboard.prop.economics.payout-conversion': '出金转化率',
  'account-dashboard.prop.insights.title': '挑战洞察',
  'account-dashboard.prop.phases.title': '阶段洞察',
  'account-dashboard.prop.phases.phase': '阶段',
  'account-dashboard.prop.phases.average-duration': '平均时长',
  'account-dashboard.prop.phases.show-more': '再显示 {count} 个',
  'account-dashboard.prop.phases.show-fewer': '收起',
  'account-dashboard.prop.tooltip.open-explanation': '说明 {metric} 的计算方式',
  'account-dashboard.prop.tooltip.calculation-unavailable':
    '尚无足够的已完成数据',
  'account-dashboard.prop.tooltip.pass-rate.description':
    '已完成挑战中通过的比例。不计入进行中的挑战，以及没有结果的已归档挑战。',
  'account-dashboard.prop.tooltip.pass-rate.formula':
    '已通过挑战 ÷ 已完成挑战 × 100',
  'account-dashboard.prop.tooltip.roi.description':
    '出金净回报（出金减去挑战成本）相对于挑战成本的比例。仅当所有挑战使用同一币种时计算。',
  'account-dashboard.prop.tooltip.roi.formula':
    '（出金 − 挑战成本）÷ 挑战成本 × 100',
  'account-dashboard.prop.tooltip.roi.no-cost':
    '这些挑战没有成本，因此没有可用于相除的成本基数。净回报即 {payouts} 的出金。',
  'account-dashboard.prop.tooltip.average-cost.description':
    '每次挑战尝试的平均成本，按币种分别计算。',
  'account-dashboard.prop.tooltip.average-cost.formula':
    '挑战成本 ÷ 挑战尝试总数',
  'account-dashboard.prop.tooltip.funded-cost.description':
    '每个已通过挑战所需的平均成本，按币种分别计算。',
  'account-dashboard.prop.tooltip.funded-cost.formula': '挑战成本 ÷ 已通过挑战',
  'account-dashboard.prop.tooltip.payout-conversion.description':
    '已通过挑战中至少产生过一次出金的比例。',
  'account-dashboard.prop.tooltip.payout-conversion.formula':
    '有出金的已通过挑战 ÷ 已通过挑战 × 100',
  'account-dashboard.prop.tabs.phases': '阶段',
  'account-dashboard.prop.tabs.firms': '交易公司',
  'account-dashboard.prop.firms.firm': '公司',
  'account-dashboard.prop.firms.attempts': '尝试次数',
  'account-dashboard.prop.phases.most-failed': '失败最多',
  'account-dashboard.prop.phases.days': '{count} 天',
  'account-dashboard.prop.phases.empty': '暂无已完成的阶段',
  'account.challenge.toggle.label': '交易考核挑战',
  'account.challenge.toggle.help': '跟踪该账户的考核阶段、公司规则和出金。',

  'notice.error.canonical-trade-type-change':
    '经纪商同步的交易不能更改为其他交易类型。',
  'trade-sync.import.account.conflict-repair':
    '发现重复的 canonicalTradeId 笔记。请保留一份，并从重复笔记中删除 canonicalTradeId 或删除该笔记。重命名文件无法修复冲突。',
  'setups.create.field.tags': '标签',
  'setups.create.placeholder.tags': '动量、突破、早盘',
  'setups.view.overview.tag-filter.aria': '筛选策略',
  'setups.view.overview.tag-filter.reset': '重置',
  'setups.view.overview.tag-filter.untagged': '无标签',
  'setups.view.overview.tag-filter.empty': '没有符合这些筛选条件的策略',
  'setups.view.overview.tag-filter.empty-submessage':
    '调整或清除筛选条件以显示更多策略。',

  'setups.view.tags': '标签',
  'setups.create.error.tag-save-failed': '无法将标签保存到全局标签列表。',
  'settings.customization.options.confirm.remove-tag-message':
    '删除全局标签“{option}”？这会从所有 Journalit 交易和策略笔记中移除该标签。',
  'settings.customization.options.confirm.reset-tag-message':
    '将全局标签列表和颜色重置为默认值？已分配给交易和策略笔记的标签会保留在这些笔记中。',
  'home.mode.overview': '概览',
  'home.mode.dashboard': '仪表盘',
  'home.mode.aria': '切换主页模式',
  'home.filters.period': '周期',
  'home.filters.trade-type': '交易类型',
  'home.filters.accounts': '账户',
  'home.filters.back': '返回',
  'filter.reset': '重置筛选器',
  'filter.menu.title': '筛选条件',
  'filter.menu.accounts': '账户',
  'filter.menu.tickers': '品种',
  'filter.menu.setups': '交易策略',
  'filter.menu.tags': '标签',
  'filter.menu.mistakes': '错误',
  'filter.menu.trade-type': '交易类型',
  'filter.menu.status': '状态',
  'filter.menu.direction': '方向',
  'filter.menu.review-status': '复盘状态',
  'filter.menu.status.cancelled': '已取消',
  'filter.menu.included-count': '已包含 {count} 项',
  'filter.menu.excluded-count': '已排除 {count} 项',
  'filter.menu.search': '搜索',
  'filter.menu.no-matches': '没有匹配项',
  'filter.menu.no-options': '暂无可筛选内容',
  'filter.menu.clear': '清除',
  'filter.menu.match.label': '匹配',
  'filter.menu.match.any': '任意一项',
  'filter.menu.match.all': '全部',
  'filter.menu.match.only': '仅这些',
  'filter.menu.match.exact': '完全一致',
  'filter.menu.match.hint.any': '至少包含一个所选值的交易。',
  'filter.menu.match.hint.all': '包含所有所选值的交易，允许有其他值。',
  'filter.menu.match.hint.only': '所有值都在所选范围内的交易。',
  'filter.menu.match.hint.exact': '值与所选完全一致的交易，不多也不少。',
  'filter.menu.match.no-value-any-only': '仅适用于“任意一项”',
  'filter.menu.exclude-value': '排除 {label}',
  'filter.menu.match.badge.all': '全部',
  'filter.menu.match.badge.only': '仅',
  'filter.menu.match.badge.exact': '完全',
  'home.guide.modes.title': '最后一件事：仪表盘',
  'home.guide.modes.description':
    '概览与仪表盘共用此页面。现在切换到仪表盘，继续进行绩效统计的简短导览。',
  'home.guide.whats-new.mode.title': '一个主页，两种模式',
  'home.guide.whats-new.mode.description':
    '概览与仪表盘现在位于同一页面。切换时会保留各自的布局和滚动位置。',
  'home.guide.whats-new.filters.title': '主页筛选集中在一处',
  'home.guide.whats-new.filters.description':
    '打开筛选按钮，即可在紧凑的分层菜单中选择周期、交易类型或账户。',
  'home.guide.whats-new.done.title': '保持工作区上下文',
  'home.guide.whats-new.done.description':
    '使用概览查看个人组件，使用仪表盘进行深入分析。每种模式都会保留自己的筛选和布局。',
  'account.prop-challenge.summary.status.payout_ready': 'Payout ready',
  'account.prop-challenge.ribbon.passed': '{phase}已通过',
  'account.prop-challenge.ribbon.failed': '{phase}未通过',
  'account.prop-challenge.ribbon.action.advance': '进入{phase}',
  'account.prop-challenge.ribbon.action.advance-short': '进入',
  'account.prop-challenge.ribbon.action.mark-passed': '标记为通过',
  'account.prop-challenge.ribbon.action.archive': '归档',
  'account.prop-challenge.actions.stale':
    '此挑战已在其他位置更新。请检查后重试。',
  'account.prop-challenge.ribbon.action.record-payout': '记录出金',
  'account.prop-challenge.ribbon.action.record-payout-short': '出金',
  'account.prop-challenge.payout.title': 'Payout readiness',
  'account.prop-challenge.payout.eligible': 'Payout ready',
  'account.prop-challenge.payout.available': 'Available now',
  'account.prop-challenge.payout.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.history': 'Payouts',
  'account.prop-challenge.payout.lifetime-qualifying-days': '累计合格交易日',
  'account.prop-challenge.payout.requirement.days': 'Trading days',
  'account.prop-challenge.payout.requirement.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout.requirement.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout.requirement.positive-cycle-profit':
    'Positive cycle profit',
  'account.prop-challenge.payout.requirement.cycle-profit': 'Cycle profit',
  'account.prop-challenge.payout.requirement.consistency': 'Consistency',
  'account.prop-challenge.payout.requirement.minimum': 'Minimum available',
  'account.prop-challenge.payout.requirement.payouts': 'Payout allowance',
  'account.prop-challenge.payout.requirement.request-window': 'Request window',
  'account.prop-challenge.payout.timezone-invalid': '不是已知时区。',
  'account.prop-challenge.payout.preview-amount': '预览出金',
  'account.prop-challenge.payout.you-receive': '交易者份额',
  'account.prop-challenge.payout.balance-after': '出金后余额',
  'account.prop-challenge.payout.drawdown-floor': '回撤下限',
  'account.prop-challenge.payout.buffer-after': 'Room before breach',
  'account.prop-challenge.payout.request-not-allowed': '此金额不符合条件',
  'account.prop-challenge.payout.immediate-breach':
    'This payout would leave the account at or below its drawdown floor.',
  'account.prop-challenge.payout.account-concludes':
    'This payout completes the configured simulated-funded payout cycle.',
  'account.prop-challenge.payout.next-stage-after-payout':
    'This payout advances the account to its next configured stage.',
  'account.prop-challenge.payout.live-review-after-payout':
    'This payout makes the account eligible for live-account review.',
  'account.prop-challenge.payout.cycle-resets':
    'Payout progress resets after an approved payout.',
  'account.prop-challenge.payout.cycle-continues':
    'Payout progress continues after an approved payout.',
  'account.prop-challenge.payout.drawdown.unchanged':
    'The current drawdown floor remains in place.',
  'account.prop-challenge.payout.drawdown.lock_at_balance':
    'The drawdown floor locks after payout.',
  'account.prop-challenge.payout.drawdown.reset_from_starting_balance':
    'The account and drawdown limits reset after payout.',
  'account.prop-challenge.stage': 'Stage type',
  'account.prop-challenge.stage.evaluation': 'Evaluation',
  'account.prop-challenge.stage.sim-funded': 'Sim funded',
  'account.prop-challenge.stage.live-funded': 'Live funded',
  'account.prop-challenge.payout-rules.title': 'Payout rules',
  'account.prop-challenge.payout-rules.add': 'Add payout rules',
  'account.prop-challenge.payout-rules.remove': 'Remove payout rules',
  'account.prop-challenge.payout-rules.cycle': 'Eligibility cycle',
  'account.prop-challenge.payout-rules.request-window': 'Request timing',
  'account.prop-challenge.payout-rules.request-window.anytime': 'Any day',
  'account.prop-challenge.payout-rules.request-window.weekdays':
    'Specific weekdays',
  'account.prop-challenge.payout-rules.request-window.time-zone': 'Time zone',
  'account.prop-challenge.payout-rules.request-window.allowed-days':
    'Allowed request days',
  'account.prop-challenge.payout-rules.cycle.none': 'No waiting cycle',
  'account.prop-challenge.payout-rules.cycle.trading-days': 'Trading days',
  'account.prop-challenge.payout-rules.cycle.qualifying-days':
    'Qualifying days',
  'account.prop-challenge.payout-rules.cycle.calendar-days': 'Calendar days',
  'account.prop-challenge.payout-rules.days': 'Required days',
  'account.prop-challenge.payout-rules.minimum-daily-profit':
    'Minimum daily profit',
  'account.prop-challenge.payout-rules.anchor': 'Cycle starts from',
  'account.prop-challenge.payout-rules.anchor.phase-start': 'Stage start',
  'account.prop-challenge.payout-rules.anchor.first-trade': 'First trade',
  'account.prop-challenge.payout-rules.minimum-balance':
    'Minimum account balance',
  'account.prop-challenge.payout-rules.minimum-cycle-profit':
    'Minimum cycle profit',
  'account.prop-challenge.payout-rules.minimum-cycle-profit-schedule':
    '按出金次数的最低周期利润',
  'account.prop-challenge.payout-rules.positive-cycle-after-first':
    'Require positive cycle profit after first payout',
  'account.prop-challenge.payout-rules.consistency-percent':
    'Maximum best-day share (%)',
  'account.prop-challenge.payout-rules.consistency-percent-schedule':
    '按出金次数的最佳单日最高占比 (%)',
  'account.prop-challenge.payout-rules.availability': 'Available profit',
  'account.prop-challenge.payout-rules.availability.starting-balance':
    'Above starting balance',
  'account.prop-challenge.payout-rules.availability.balance-floor':
    'Above balance floor',
  'account.prop-challenge.payout-rules.balance-floor': 'Balance floor',
  'account.prop-challenge.payout-rules.request-percent':
    'Withdrawable share (%)',
  'account.prop-challenge.payout-rules.new-profit-percent':
    'New profit required from each request (%)',
  'account.prop-challenge.payout-rules.new-profit-percent-help':
    'Caps the request so the configured percentage is backed by profit earned during the current payout cycle. For example, 50% allows a request up to twice current-cycle profit.',
  'account.prop-challenge.payout-rules.minimum-request': 'Minimum request',
  'account.prop-challenge.payout-rules.maximum': 'Maximum request',
  'account.prop-challenge.payout-rules.maximum.none': 'No maximum',
  'account.prop-challenge.payout-rules.maximum.fixed': 'Fixed maximum',
  'account.prop-challenge.payout-rules.maximum.first-fixed-then-none':
    '仅首次提现上限',
  'account.prop-challenge.payout-rules.maximum.schedule':
    'Maximum by payout number',
  'account.prop-challenge.payout-rules.maximum.cycle-profit-percent':
    '周期利润百分比',
  'account.prop-challenge.payout-rules.maximum-amount': 'Maximum amount',
  'account.prop-challenge.payout-rules.maximum-first-amount': '首次提现上限',
  'account.prop-challenge.payout-rules.maximum-cycle-profit-percent':
    '最大周期利润 (%)',
  'account.prop-challenge.payout-rules.schedule-repeat-last':
    'Keep using the final amount for later payouts',
  'account.prop-challenge.payout-rules.schedule-repeat-value':
    '后续出金继续使用最终值',
  'account.prop-challenge.payout-rules.schedule': 'Amounts by payout number',
  'account.prop-challenge.payout-rules.profit-split': 'Trader profit share (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock':
    '累计合格交易日达标后更改限制',
  'account.prop-challenge.payout-rules.lifetime-unlock-help':
    '统计整个资助阶段的合格交易日，即使出款周期已重置也会保留累计值。',
  'account.prop-challenge.payout-rules.lifetime-unlock-days':
    '所需累计合格交易日',
  'account.prop-challenge.payout-rules.lifetime-unlock-availability':
    '解锁后的可用规则',
  'account.prop-challenge.payout-rules.lifetime-unlock-balance-floor':
    '解锁后的余额底线',
  'account.prop-challenge.payout-rules.lifetime-unlock-request-percent':
    '解锁后的可用利润 (%)',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum':
    '解锁后的最高申请额',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-amount':
    '解锁后的最高金额',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-schedule':
    '解锁后的最高金额计划',
  'account.prop-challenge.payout-rules.lifetime-unlock-maximum-cycle-profit-percent':
    '解锁后的周期利润最高百分比',
  'account.prop-challenge.payout-rules.profit-split-model': '利润分成模式',
  'account.prop-challenge.payout-rules.profit-split.fixed': '固定百分比',
  'account.prop-challenge.payout-rules.profit-split.threshold':
    '累计出金后调整',
  'account.prop-challenge.payout-rules.profit-split.initial':
    '交易者初始分成 (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-amount':
    '累计出金阈值',
  'account.prop-challenge.payout-rules.profit-split.thereafter':
    '超过阈值后的分成 (%)',
  'account.prop-challenge.payout-rules.maximum-payouts': 'Maximum payouts',
  'account.prop-challenge.payout-rules.maximum-payout-outcome':
    'After final payout',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.continue':
    'Continue account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.conclude':
    'Conclude account',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.promote':
    'Advance to next stage',
  'account.prop-challenge.payout-rules.maximum-payout-outcome.live-review':
    'Eligible for live review',
  'account.prop-challenge.payout-rules.aftermath': 'After an approved payout',
  'account.prop-challenge.payout-rules.aftermath.unchanged':
    'Deduct payout; keep drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.lock':
    'Deduct payout; lock drawdown floor',
  'account.prop-challenge.payout-rules.aftermath.reset':
    'Reset account and drawdown',
  'account.prop-challenge.payout-rules.drawdown-floor':
    'Drawdown floor after payout',
  'account.prop-challenge.payout-rules.first-payout-exempt':
    'First payout ignores minimum cycle profit',
  'account.prop-challenge.payout-rules.reset-cycle':
    'Reset eligibility cycle after payout',
  'account.prop-challenge.payout-rules.group.eligibility': 'Eligibility',
  'account.prop-challenge.payout-rules.group.availability': 'Available payout',
  'account.prop-challenge.payout-rules.group.terms': 'Payout terms',
  'account.prop-challenge.payout-rules.group.aftermath': 'After payout',
  'account.prop-challenge.payout.requirement.elapsed-hours': 'Elapsed time',
  'account.prop-challenge.payout-rules.profit-split.account-profit-threshold':
    'Changes by account profit',
  'account.prop-challenge.payout-rules.profit-split.account-profit-help':
    'Lifetime account profit equals current balance minus starting balance plus prior withdrawals. The below or at/above percentage applies to the entire request.',
  'account.prop-challenge.payout-rules.profit-split.below':
    'Trader share below threshold (%)',
  'account.prop-challenge.payout-rules.profit-split.threshold-profit':
    'Account profit threshold',
  'account.prop-challenge.payout-rules.profit-split.at-or-above':
    'Trader share at or above threshold (%)',
  'account.prop-challenge.payout-rules.minimum-elapsed-hours':
    'Minimum elapsed hours',

  
  'account.merge.challenge.move-earlier': '将 {account} 前移',
  'account.merge.challenge.move-later': '将 {account} 后移',
  'account.merge.warning.use-profile-balance': '使用机构的余额',
  'account.merge.warning.edit-phases': '编辑阶段',
  'account.merge.title': '挑战设置',
  'account.merge.loading': '加载中...',
  'account.merge.step.accounts': '账户',
  'account.merge.step.phases': '阶段',
  'account.merge.step.review': '检查',
  'account.merge.accounts.title': '要合并的账户',
  'account.merge.accounts.show-archived': '显示已归档',
  'account.merge.accounts.empty': '没有符合条件的账户',
  'account.merge.target.title': '目标账户',
  'account.merge.target.keep': '保留',
  'account.merge.target.new': '新名称',
  'account.merge.phase.name': '阶段名称',
  'account.merge.phase.status': '状态',
  'account.merge.phase.started': '开始',
  'account.merge.phase.completed': '结束',
  'account.merge.phase.no-rules': '无',
  'account.merge.review.notes': '已迁移交易',
  'account.merge.review.identities': '经纪商账户',
  'account.merge.warning.trade-outside-window': '交易不在其阶段区间内',
  'account.merge.warning.identity-shared': '标识被多个账户占用',
  'account.merge.warning.copy-trading-dropped': '已丢弃跟单周期',
  'account.merge.error.too-few-sources': '请至少选择两个账户。',
  'account.merge.error.duplicate-source': '某个账户重复出现。',
  'account.merge.error.target-exists': '该名称属于另一个账户。',
  'account.merge.error.currency-mismatch': '账户使用了不同的货币。',
  'account.merge.error.timeline-not-monotonic': '各阶段开始时间必须递增。',
  'account.merge.error.invalid-override': '请检查该阶段的日期。',
  'account.merge.error.source-missing': '某个账户没有已保存的设置。',
  'account.merge.error.unknown': '合并失败。',
  'account.merge.action.merge': '合并',
  'account.merge.action.undo': '撤销',
  'account.merge.action.looks-right': '没问题',
  'account.merge.action.delete': '删除旧账户',
  'account.merge.notice.converted': '已转换为挑战',
  'account.merge.summary.intro': '请确认这与你的挑战一致：',
  'account.merge.summary.phases': '阶段：{phases}',
  'account.merge.summary.current': '当前处于 {phase}（{stage}），开始于 {date}',
  'account.merge.summary.current-stage': '当前处于 {phase}，开始于 {date}',
  'account.merge.summary.trades': '{total} 笔交易中有 {counted} 笔计入挑战',
  'account.merge.summary.trades-missing':
    '{total} 笔交易中有 {counted} 笔计入挑战。其余交易不在任何阶段的日期内。',
  'account.merge.summary.rules': '{phase} 规则：{rules}',
  'account.merge.summary.no-rules':
    '{phase} 尚未设置规则。请在编辑账户中添加你机构的规则。',
  'account.merge.notice.title': '合并自 {accounts}',
  'account.merge.notice.error': '操作失败。',
  'account.merge.undo.title': '撤销合并',
  'account.merge.undo.message': '恢复旧账户及其交易。',
  'account.merge.delete.title': '删除旧账户',
  'account.merge.delete.message': '删除已归档的旧账户，此操作无法撤销。',
  'command.open-legacy-challenge-onboarding': '设置 Prop 挑战',
  'account.merge.step.challenge': '挑战',
  'account.merge.action.convert': '转换',
  'account.merge.profile.applied': '已应用：{firm} · {challenge}',
  'account.merge.profile.remove': '移除',
  'account.merge.phase.apply-profile': '应用机构规则',
  'account.merge.profile.replace-rules.title': '替换手动输入的规则？',
  'account.merge.profile.replace-rules.body':
    '{firm} 的资料定义了每个阶段的规则。你在此页输入的规则将被替换。',
  'account.merge.profile.replace-rules.confirm': '替换规则',
  'guide.legacy-setup.list.title': '这里列出了每个尚无挑战的账户',
  'guide.legacy-setup.list.description':
    '逐个账户决定。“保持原样”会让它完全不变；之后随时可以在仪表盘设置中再设置。',
  'guide.legacy-setup.assign.title': '把同一挑战的各阶段归为一组',
  'guide.legacy-setup.assign.description':
    '曾是同一挑战各阶段的账户放入同一组（我们会根据相似名称给出建议）。单独的账户会成为单阶段挑战。',
  'guide.legacy-setup.continue.title': '每个挑战一次简短设置',
  'guide.legacy-setup.continue.description':
    '“继续”会依次为每个组打开挑战设置。在你逐一确认之前不会有任何改动。',
  'guide.merge-wizard.target.title': '由一个账户保留历史',
  'guide.merge-wizard.target.description':
    '目标账户保留并附带所有阶段。其他账户会被归档而非删除，其交易会移到目标账户。',
  'guide.merge-wizard.identity.title': '选择你机构的规则',
  'guide.merge-wizard.identity.description':
    '选择你的机构和计划以填入阶段和规则。没有你的机构？选择“其他 / 自定义机构”，并在下一页设置规则。',
  'guide.merge-wizard.identity.free-title': '为挑战命名',
  'guide.merge-wizard.identity.free-description':
    '为它取个名字，也可以填上你的机构。之前挑战中保存的规则会填入阶段和规则；否则请在下一页设置。',
  'guide.merge-wizard.phases.title': '检查每个阶段',
  'guide.merge-wizard.phases.description':
    '设置阶段类型，把已完成的阶段标为“已通过”、当前阶段标为“进行中”，并确认日期。',
  'guide.merge-wizard.review.title': '确认之前不会有任何改动',
  'guide.merge-wizard.review.description':
    '转换后，账户页面会列出已设置的内容供你检查，也可以在那里撤销。',
  'account.merge.challenge.accounts': '账户',
  'account.merge.challenge.order-hint': '最早的阶段在前',
  'account.merge.challenge.single-hint': '此账户将单独成为一个挑战',
  'account.merge.phase.broker-accounts.one': '{count} 个经纪商账户',
  'account.merge.phase.broker-accounts.few': '{count} 个经纪商账户',
  'account.merge.phase.broker-accounts.many': '{count} 个经纪商账户',
  'account.merge.phase.broker-accounts.other': '{count} 个经纪商账户',
  'account.merge.review.phase-count.one': '个阶段',
  'account.merge.review.phase-count.few': '个阶段',
  'account.merge.review.phase-count.many': '个阶段',
  'account.merge.review.phase-count.other': '个阶段',
  'account.merge.phase.pending': '待定',
  'account.merge.phase.starts-after': '通过 {phase} 后开始',
  'account.merge.phase.pending-rules': '规则：{rules}',
  'account.merge.review.archived': '已归档',
  'account.merge.review.starts-after': '{phase} 之后',
  'account.merge.review.since': '自 {date} 起',
  'account.merge.sequence': '挑战 {index} / {total}',
  'account.merge.warning.balance-differs': '初始余额与机构规则不同',
  'account.merge.error.profile-phase-mismatch': '账户数量多于机构规则中的阶段',
  'account.merge.error.profile-currency-mismatch':
    '机构规则使用的货币与这些账户不同。',
  'account.merge.error.source-changed': '有账户已更改。请重新检查合并。',
  'account.merge.error.multiple-active-phases':
    '只能是最后一个账户仍处于进行中。',
  'account.merge.error.phases-after-failed-source':
    '失败的账户会结束挑战，因此必须放在最后选择。',
  'account.merge.error.copy-trading-overlap':
    '跟单周期重叠。请先结束其中一个。',
  'onboarding.legacy-challenge.legend':
    '选择如何处理每个旧账户。你是否为每个阶段单独建了账户，比如第 1 阶段和已获资助？把它们放入同一个挑战，就会合并为一个带阶段的账户。',
  'onboarding.legacy-challenge.assign.leave': '保留为普通账户',
  'onboarding.legacy-challenge.assign.own': '转为挑战',
  'onboarding.legacy-challenge.assign.group': '加入挑战 {letter}',
  'onboarding.legacy-challenge.assign.new-group': '合并为新的挑战…',
  'onboarding.legacy-challenge.action.continue': '继续',
  'onboarding.legacy-challenge.action.continue-count': '设置 {count} 个',
  'guide.action-step.dismiss': '暂不',
  'guide.legacy-challenge.title': '设置此次更新之前的账户',
  'guide.legacy-challenge.description':
    '将旧的考核或已获资助账户转为挑战。设置会引导你完成阶段和日期，并在最后显示已设置的内容供你检查。',
  'guide.legacy-challenge.action': '设置我的账户',
  'account-dashboard.challenges.empty.title': '还没有挑战',
  'account-dashboard.challenges.empty.message':
    '将自营交易公司的挑战作为一个包含阶段、规则和出金的账户来跟踪。',
  'account-dashboard.challenges.empty.create': '新建挑战',
  'account-dashboard.challenges.empty.setup': '设置现有账户',
  'onboarding.legacy-challenge.title': 'Prop 挑战',
  'onboarding.legacy-challenge.action.skip': '跳过',
  'onboarding.legacy-challenge.accounts.show-archived': '显示已归档',
  'onboarding.legacy-challenge.accounts.empty': '没有需要设置的账户',
  'onboarding.legacy-challenge.loading': '加载中...',
  'onboarding.legacy-challenge.suggested': '推荐',
  'onboarding.legacy-challenge.row.aria': '{account} 的操作',
  'onboarding.legacy-challenge.status.combined': '已合并',
  'onboarding.legacy-challenge.status.converted': '已转换',
  'onboarding.legacy-challenge.entry.name': 'Prop 挑战',
  'onboarding.legacy-challenge.entry.desc': '将现有账户合并或转换为挑战。',
  'onboarding.legacy-challenge.entry.action': '设置',

  'view.home': '主页',
  'common.lose': '亏',

  'dashboard.conversion.requires-conversion': '多货币盈亏图表需要汇率转换。',

  'auth.error.invalid-email': '请输入有效的邮箱地址',
  'auth.error.invalid-code': '验证码无效',
  'form.layout.guide-trigger-label': '自定义表单',
  'dashboard.filter.setup.none-found': '未找到策略',
  'nav.weekly': '周度复盘',
  'account.create.field.drawdown-type-desc': '无 | 固定 | 每日收盘追踪 | 手动',
  'account.edit.field.drawdown-type-desc': '无 | 固定 | 每日收盘追踪 | 手动',
  'trade.details.execution': 'Execution',
  'csv.errors.group.close-only': '已跳过仅平仓的执行',
  'csv.report.file': '文件:{file}',
  'trade-sync.gate.signin.cta': '登录',
  'backend.progress.ftp.desc': '创建凭证',
  'csv.broker-guide.sierrachart.warning.message':
    'Export 选项会保存未调整的价格。Save Log As 会保留显示的价格。',
  'csv.broker-guide.rithmic.step-1':
    '在 R | Trader Pro 打开 Order History,并按账户与日期筛选 Completed/Filled',
  'csv.broker-guide.rithmic.step-2':
    '在 Add/Remove Columns 中确保显示 Side、Symbol、Qty Filled、Avg Fill Price、Fill/Update Time',
  'drc.preparation.checklist.title': '交易前检查清单',
  'weekly.overview.drawdown-chart.empty': '无回撤数据可显示',
  'monthly.game.header.a-games': 'A级表现',
  'onboarding.welcome.insight.timing.title': '时机模式',
  'onboarding.wizard.error.account-service': 'AccountPageService 不可用',
  'trade-import.preview.message.no-open-match':
    'No matching open trade found for close-only preview',
  'setups.view.detail.execution-gap.title': '执行差距',
  'trade-sync.import.action.sync-cloud': 'Sync cloud trades',
  'session-log.placeholder.entry': '你正在观察、思考或感受到什么？',
  'session-mode.unconfigured.step.gate.description':
    'Starter IF/THEN checklist is ready.',
  'setups.view.action.refresh': '刷新',
  'setups.view.detail.no-playbook': '尚未编写交易计划。',

  'home.widget.streak.kind.trade-outcome': '交易结果',
  'home.widget.streak.kind.trade-review': '交易复盘',
  'home.widget.streak.kind.drc-review': 'DRC 复盘',
  'home.widget.streak.kind.weekly-review': '周复盘',
  'home.widget.streak.kind.monthly-review': '月复盘',
  'home.widget.streak.configure': '选择连胜类型',
  'home.widget.streak.configure-aria': '配置 {kind} 连胜',
  'home.widget.streak.no-review-streak': '暂无活跃复盘连胜',
  'home.widget.streak.start-reviewing': '开始复盘以建立连胜',
  'home.widget.streak.keep-reviewing': '继续复盘以保持连胜',
  'home.widget.streak.reviewed-trades-in-a-row.one': '连续复盘交易',
  'home.widget.streak.reviewed-trades-in-a-row.few': '连续复盘交易',
  'home.widget.streak.reviewed-trades-in-a-row.many': '连续复盘交易',
  'home.widget.streak.reviewed-trades-in-a-row.other': '连续复盘交易',
  'home.widget.streak.reviewed-days-in-a-row.one': '连续复盘天数',
  'home.widget.streak.reviewed-days-in-a-row.few': '连续复盘天数',
  'home.widget.streak.reviewed-days-in-a-row.many': '连续复盘天数',
  'home.widget.streak.reviewed-days-in-a-row.other': '连续复盘天数',
  'home.widget.streak.reviewed-weeks-in-a-row.one': '连续复盘周数',
  'home.widget.streak.reviewed-weeks-in-a-row.few': '连续复盘周数',
  'home.widget.streak.reviewed-weeks-in-a-row.many': '连续复盘周数',
  'home.widget.streak.reviewed-weeks-in-a-row.other': '连续复盘周数',
  'home.widget.streak.reviewed-months-in-a-row.one': '连续复盘月数',
  'home.widget.streak.reviewed-months-in-a-row.few': '连续复盘月数',
  'home.widget.streak.reviewed-months-in-a-row.many': '连续复盘月数',
  'home.widget.streak.reviewed-months-in-a-row.other': '连续复盘月数',
  'home.widget.streak.missed-trades.one': '自上次复盘以来漏了 {count} 笔交易',
  'home.widget.streak.missed-trades.few': '自上次复盘以来漏了 {count} 笔交易',
  'home.widget.streak.missed-trades.many': '自上次复盘以来漏了 {count} 笔交易',
  'home.widget.streak.missed-trades.other': '自上次复盘以来漏了 {count} 笔交易',
  'home.widget.streak.missed-days.one': '自上次复盘以来漏了 {count} 天',
  'home.widget.streak.missed-days.few': '自上次复盘以来漏了 {count} 天',
  'home.widget.streak.missed-days.many': '自上次复盘以来漏了 {count} 天',
  'home.widget.streak.missed-days.other': '自上次复盘以来漏了 {count} 天',
  'home.widget.streak.missed-weeks.one': '自上次复盘以来漏了 {count} 周',
  'home.widget.streak.missed-weeks.few': '自上次复盘以来漏了 {count} 周',
  'home.widget.streak.missed-weeks.many': '自上次复盘以来漏了 {count} 周',
  'home.widget.streak.missed-weeks.other': '自上次复盘以来漏了 {count} 周',
  'home.widget.streak.missed-months.one': '自上次复盘以来漏了 {count} 个月',
  'home.widget.streak.missed-months.few': '自上次复盘以来漏了 {count} 个月',
  'home.widget.streak.missed-months.many': '自上次复盘以来漏了 {count} 个月',
  'home.widget.streak.missed-months.other': '自上次复盘以来漏了 {count} 个月',
  'trade-sync.quick.started': '正在同步已启用的交易来源…',
  'trade-sync.quick.running': '正在同步…',
  'trade-sync.quick.offline': '交易同步需要互联网连接。请在联网后重试。',
  'trade-sync.quick.no-sources':
    '未找到已启用的交易同步来源。请在设置中配置 Trade Sync。',
  'trade-sync.quick.complete':
    '交易同步完成：已同步 {sources} 个来源，并导入或更新 {imported} 笔交易。',
  'trade-sync.quick.partial':
    '交易同步完成但存在问题：{total} 个来源中有 {completed} 个完成，并导入或更新 {imported} 笔交易。',
  'trade-sync.quick.failed':
    '无法完成 {sources} 个来源的交易同步。请检查 Trade Sync 设置后重试。',
  'navigation.items.nav-sync-trades': '同步交易',
  'command.sync-trades-now': '同步交易',
  'home.quick-links.sync-trades': '同步交易',
  'trade-sync.quick.not-ready':
    '当前没有已启用的交易同步来源可用。请等待正在进行的同步完成，或检查 Trade Sync 设置。',
  'trade-sync.quick.mapping-required':
    '已导入或更新 {imported} 笔交易。请在“设置 → Trade Sync”中完成 {providers} 的账户映射，然后重试。',
  'trade-handoff.action.view-trades-count.one': '查看 {count} 笔交易',
  'trade-handoff.action.view-trades-count.few': '查看 {count} 笔交易',
  'trade-handoff.action.view-trades-count.many': '查看 {count} 笔交易',
  'trade-handoff.action.view-trades-count.other': '查看 {count} 笔交易',
  'trade-handoff.action.review-now': '立即复盘',
  'trade-handoff.action.open-period': '打开 {period} 复盘',
  'trade-handoff.review.creation-disabled':
    '该复盘不存在，且自动创建复盘已关闭。',
  'trade-handoff.review.open-failed': '无法打开该复盘。',
  'trade-handoff.trades.open-failed': '无法打开交易日志。',
  'trade-handoff.scope.label': '正在显示 {accounts} 最近一次操作中的 {trades}',
  'trade-handoff.scope.exit': '退出操作视图',
  'trade-handoff.trade-count.one': '{count} 笔交易',
  'trade-handoff.trade-count.few': '{count} 笔交易',
  'trade-handoff.trade-count.many': '{count} 笔交易',
  'trade-handoff.trade-count.other': '{count} 笔交易',
  'trade-handoff.title.sync': '同步完成',
  'trade-handoff.summary.import-complete': '已导入{trades}',
  'trade-handoff.summary.import-partial': '已导入{trades}，但存在问题',
  'trade-handoff.summary.sync-complete': '已同步{trades}',
  'trade-handoff.summary.sync-partial': '已同步{trades}，但存在问题',
  'trade-handoff.periods.choose': '选择其他复盘周期',
  'trade-handoff.periods.recommended': '推荐',
  'trade-handoff.action.dismiss': '关闭最近的交易结果',
  'sample.action.try': '试用示例日志',
  'sample.action.reset': '重置示例',
  'sample.popout.title': '示例日志',
  'sample.popout.action.exit': '退出',
  'sample.popout.description': '此处的更改仅用于练习。',
  'sample.popout.closed': '练习日志已保存并关闭。',
  'sample.popout.recovery': '练习日志需要恢复。',
  'sample.notice.sync-blocked': '你正在编辑虚构的示例数据。后端同步已暂停。',
  'sample.notice.folder-locked': '示例日志处于活动状态时，无法更改日志文件夹。',
  'sample.empty.description':
    '浏览已填充的虚构日志，而不会更改你的日志文件或设置。',
  'sample.progress.creating': '正在创建示例日志：已完成 {completed}/{total} 项',
  'sample.progress.removing': '正在移除示例日志：{completed}/{total} 项',
  'sample.progress.verifying': '正在检查示例日志：{completed} / {total} 项',
  'sample.exit.title': '退出示例日志？',
  'sample.exit.remove-warning':
    '移除会删除已确认归属于示例的文件中的编辑。无法证明示例所有权的文件将被保留。',
  'sample.exit.remove': '退出并移除',
  'sample.reset.title': '要重置示例日志吗？',
  'sample.reset.message':
    '这会将所有示例文件和仅用于示例的设置恢复为原始虚构数据包。',
  'sample.reset.warning': '你在示例日志中的编辑将被删除。',
  'sample.collision.title': '示例文件夹已存在',
  'sample.collision.message':
    'Journalit 不会覆盖现有文件夹。是否改为在“{path}”创建示例日志？',
  'sample.collision.confirm': '使用可用文件夹',
  'sample.notice.ready': '示例日志已准备就绪。',
  'sample.notice.reset': '示例日志已恢复。',
  'sample.notice.reset-preserved':
    '示例日志已恢复。已保留 {count} 个无法证明所有权的文件。',
  'sample.notice.removed': '示例日志已移除。',
  'sample.notice.removed-preserved':
    '示例日志已移除。已保留 {count} 个无法证明所有权的文件。',
  'sample.notice.error': '示例日志操作失败：{error}',
  'command.open-sample-journal': '打开示例日志',
  'command.exit-sample-journal': '退出示例日志',
  'command.reset-sample-journal': '重置示例日志',
  'sample.notice.busy': '另一项示例日志操作正在进行中。',
};

export default zh;
