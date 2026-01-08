# LS2
# Goal
φ60×90L トースカン心出し後の旋盤作業（STEP1〜STEP5）を、
Z/X操作と正誤判定つきで反復できるWeb教材として実装する。

# Machine assumptions
- 機種：LEO-80A 相当
- 軸：Z（長手方向）、X（径方向）
- 相対ゼロ：Z, X ともにゼロセット可能
- 手動ハンドル：
  - Z(大) ハンドル：長手送り
  - X(中) ハンドル：径方向送り
  - 小ハンドル：精密送り
- 自動送り：ON/OFF（0.1, 0.3 など送り切替 UI は既存のまま）
- 回転数：UIのボタン（1800 / 700 / 570 / 360 / 290 / 142 / 58）から選択
- 工具選択：外径荒・外径仕上・溝バイト・面取り・センタドリル・ドリル・突切りなど

# Learning scope
- 対象作業：φ60×90L トースカン心出し後 作業手順 STEP1〜STEP5
  - STEP1：端面処理（基準点づくり）
  - STEP2：外径荒加工（φ60 → φ40.5 → φ30.5 → φ22.5）
  - STEP3：溝加工（φ22.5 → φ18.0）
  - STEP4：外径仕上げ（φ22.5 → φ21.75 / φ30.5 → φ30.0）
  - STEP5：面取り（C面加工）

# Evaluation rules
- 正解条件：
  - 現在の Z, X が step.target の許容範囲内（tolerance）に入っている
  - 使用工具 toolId が step.requiredTool と一致
  - 回転数 rpm が step.requiredRpm と一致（または許容範囲内）
  - 送りモード feedOn / feed が step.requiredMode / step.requiredFeed と一致
- 不正解条件：
  - 上記のいずれかを満たさない場合
  - → evaluate() で判定し、警告メッセージと hintText を表示し、必要なら座標を戻す

# Cutting visualization level
- Lv2：2D断面（Z方向の半径プロファイル）
  - workpieceProfile[zIndex] = radius
  - 工具が当たった範囲の radius を更新（削る＝半径が小さくなる）
- 表示：
  - Canvas または既存の描画領域に、Z横軸・半径縦軸の断面形状を描画
  - 「削れていく」変化が視覚的に分かることを優先

# Design constraints / 禁止事項
- 工程ロジック（STEP1〜5）はコードに直書きしない（必ず steps.json にデータとして定義する）
- UI イベントと machineState の更新ロジックを分離する
- 描画ロジックと切削ロジックを分離する
- AI にコード修正を依頼する際は、必ず以下のファイル構成を前提とする：
  - requirements.md（本ファイル）
  - steps.json（工程データ）
  - state.js（machineState 定義）
  - render.js（描画の入口）
  - simulate.js（切削ロジックの入口）
  - evaluate.js（正誤判定ロジック）
