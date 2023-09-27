
## Tasks
| 値名       | 型  | デフォルト値  | 特殊操作   | 備考　      |
|------------|-----|-------------|-----------|------------|
| id         | int |             | keyPath autoIncrement | keyPath=主キー。ユニークなもの(のはず) |
| categoryId | int | 0           |           | カテゴリーのid。外部参照なんてものはindexeddbにはない。 |
| memo       | str | ""          |           |           |
| limit      | int | 作成日の24時 |           | タイムスタンプで保存。 |
| amount     | int | 1           |           |1=半日、自然数のみ許容 |
| start      | int | 作成日時     |           | タイムスタンプで保存。 |
| done       | int | 0           |           |true=1、false=0。|
| archive    | int | 0           |           |true=1、false=0。|
| createdAt  | int |             |           |作成した時間のタイムスタンプ。db内で自動で作成 |
| updatedAt  | int |             |           | 変更された時間のタイムスタンプ。db内で自動で作成 |
#### 扱う際の注意点
- タイムスタンプはdb外に出す場合date型に変換して扱う
- gategoryIdはcategryに存在しない場合、0(その他)とする
- 削除とarchiveは別で作成する。
- doneとarchiveの値が1・0以外の時はfalseとする
- 入力がなかった際はデフォルト値となる
