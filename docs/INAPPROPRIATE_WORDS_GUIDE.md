# Quản lý danh sách từ không phù hợp

## Cách sử dụng

### Option 1: Sử dụng file JSON (Khuyến nghị cho production)

File: `public/inappropriate-words.json`

Hệ thống sẽ tự động load từ file này khi khởi động. Bạn có thể edit trực tiếp file JSON:

```json
{
  "words": [
    "từ không phù hợp 1",
    "từ không phù hợp 2"
  ]
}
```

### Option 2: Sử dụng file Excel (Dễ chỉnh sửa)

1. **Tạo/Chỉnh sửa file Excel:**
   - Tạo file: `public/inappropriate-words.xlsx`
   - Mở bằng Excel/Google Sheets
   - Nhập danh sách từ vào cột A (một từ mỗi dòng)
   - Lưu file

2. **Convert Excel sang JSON:**
   ```bash
   node scripts/convert-inappropriate-words.js
   ```

3. **Restart ứng dụng** để load danh sách mới

### Cấu trúc file Excel

| A (Từ không phù hợp) |
|---------------------|
| đồ chó              |
| ngu ngốc            |
| fuck                |
| ...                 |

## Lưu ý

- File JSON trong `public/` sẽ được load khi app khởi động
- Nếu không load được file, hệ thống sẽ dùng danh sách mặc định trong `constants/index.js`
- Mỗi lần cập nhật file, cần restart app hoặc refresh trang để cache được cập nhật
- File Excel chỉ cần có 1 cột, các từ được liệt kê từng dòng

## Script convert

Script `convert-inappropriate-words.js` sẽ:
- Đọc file Excel từ `public/inappropriate-words.xlsx`
- Lấy tất cả giá trị từ cột A
- Lọc bỏ dòng trống
- Ghi ra file JSON với format chuẩn
- Thêm timestamp `lastUpdated`
