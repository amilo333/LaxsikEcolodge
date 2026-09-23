'use client';

import { useLocale } from 'next-intl';
import { useLayoutEffect, type ReactNode } from 'react';

type TranslationPair = readonly [vietnamese: string, english: string];

const PAIRS: TranslationPair[] = [
  ['Đang mở dashboard', 'Opening dashboard'],
  ['Đang tải dashboard…', 'Loading dashboard…'],
  ['Tổng quan hệ thống', 'System overview'],
  ['Quản lý người dùng', 'User management'],
  ['Quản lý phòng', 'Room management'],
  ['Quản lý tour', 'Tour management'],
  ['Quản lý booking', 'Booking management'],
  ['Quản lý voucher', 'Voucher management'],
  ['Quản lý Dining', 'Dining management'],
  ['Quản lý Spa & Massage', 'Spa & Massage management'],
  ['Tổng quan', 'Overview'],
  ['Người dùng', 'Users'],
  ['Phòng', 'Rooms'],
  ['Đơn đặt phòng', 'Room bookings'],
  ['Mã ưu đãi', 'Promotion codes'],
  ['Nhà hàng & dịch vụ', 'Restaurant & services'],
  ['Hành trình trải nghiệm', 'Experience journeys'],
  ['Tài khoản & quyền', 'Accounts & permissions'],
  ['Kho phòng', 'Room inventory'],
  ['Xem website', 'View website'],
  ['Đăng xuất', 'Sign out'],
  ['Admin Dashboard', 'Admin Dashboard'],

  ['Hôm nay', 'Today'],
  ['Hôm qua', 'Yesterday'],
  ['7 ngày qua', 'Last 7 days'],
  ['7 ngày gần nhất', 'Last 7 days'],
  ['Tháng này', 'This month'],
  ['Tháng trước', 'Last month'],
  ['Từ 00:00 đến hiện tại', 'From midnight until now'],
  ['Trọn ngày hôm qua', 'Full previous day'],
  ['Từ đầu tháng đến nay', 'From the start of this month'],
  ['Trọn tháng trước', 'Full previous month'],
  ['Chọn khoảng thống kê', 'Select reporting period'],
  [
    'Chọn ngày bắt đầu và số ngày từ 1 đến 366.',
    'Choose a start date and a period from 1 to 366 days.',
  ],
  ['Theo ngày', 'By day'],
  ['Theo thứ', 'By weekday'],
  ['Theo tháng', 'By month'],
  ['Doanh thu', 'Revenue'],
  ['Doanh thu đã thu', 'Collected revenue'],
  ['Tiền thực tế đã thu', 'Actual amount collected'],
  ['Số tiền thực tế đã thu', 'Actual amount collected'],
  ['Tổng quan kinh doanh', 'Business overview'],
  ['Bức tranh đặt phòng', 'Booking overview'],
  [
    'Theo dõi doanh thu thực thu, booking và hiệu quả phòng trong cùng một màn hình.',
    'Track collected revenue, bookings and room performance in one dashboard.',
  ],
  ['Diễn biến đặt phòng', 'Booking trends'],
  ['Đang cập nhật', 'Updating'],
  ['% so với kỳ trước', '% vs previous period'],
  ['Kèm số booking trong cùng kỳ', 'With bookings in the same period'],
  [
    'Phòng trống và đã sử dụng theo ngày',
    'Daily room availability and occupancy',
  ],
  [
    'Tính theo phòng đang mở bán. Booking chờ xác nhận hoặc đã xác nhận được tính là phòng đang giữ; ngày trả phòng không tính là đêm lưu trú.',
    'Based on rooms available for sale. Pending or confirmed bookings count as held rooms; checkout dates do not count as room nights.',
  ],
  ['Từ ngày', 'From date'],
  ['Số ngày', 'Number of days'],
  ['Xem thống kê', 'View statistics'],
  ['Tải lại', 'Reload'],
  ['Biểu đồ doanh thu đặt phòng', 'Room booking revenue chart'],
  ['Biểu đồ đêm phòng và số booking', 'Room nights and booking count chart'],
  ['Biểu đồ tỷ lệ trạng thái booking', 'Booking status distribution chart'],
  [
    'Biểu đồ công suất phòng trong khoảng ngày đã chọn',
    'Room occupancy chart for the selected date range',
  ],
  ['Giá trị trung bình / booking', 'Average value / booking'],
  ['Booking trong kỳ', 'Bookings in period'],
  ['Booking hợp lệ', 'Valid bookings'],
  ['Khách đặt phòng', 'Booking guests'],
  ['Đêm phòng', 'Room nights'],
  ['đêm phòng', 'room nights'],
  ['Đêm phòng trong kỳ', 'Room nights in period'],
  ['Đêm phòng đã đặt', 'Booked room nights'],
  ['Đêm phòng còn trống', 'Available room nights'],
  ['Số đêm trung bình / booking', 'Average nights / booking'],
  ['Số phòng trung bình / booking', 'Average rooms / booking'],
  ['Số phòng mỗi ngày', 'Rooms per day'],
  ['Tổng phòng mở bán', 'Total rooms for sale'],
  ['Công suất', 'Occupancy'],
  ['Công suất phòng', 'Room occupancy'],
  ['Tỷ lệ đêm phòng đã sử dụng', 'Occupied room-night rate'],
  ['Đã đặt / sử dụng', 'Booked / occupied'],
  ['Còn trống', 'Available'],
  ['Check-in hôm nay', 'Check-ins today'],
  ['Check-out hôm nay', 'Check-outs today'],
  ['Tỷ trọng đêm phòng', 'Room-night distribution'],
  ['Chi tiết từng loại phòng', 'Details by room type'],
  ['Hiệu quả loại phòng', 'Room type performance'],
  ['Theo loại phòng', 'By room type'],
  ['Theo từng ngày', 'By individual day'],
  ['Công suất theo loại phòng', 'Occupancy by room type'],
  [
    'Phân tích theo các booking trong khoảng thời gian đã chọn',
    'Analysis of bookings in the selected period',
  ],
  [
    'Top 5 loại phòng trong khoảng ngày đã chọn',
    'Top 5 room types in the selected period',
  ],
  [
    'Đơn vị: đêm phòng. Phòng bảo trì hoặc ngừng bán không nằm trong số phòng trống.',
    'Unit: room nights. Rooms under maintenance or unavailable for sale are excluded from availability.',
  ],
  ['Booking gần đây', 'Recent bookings'],
  ['5 đơn mới nhất trong hệ thống', '5 latest bookings in the system'],
  ['Cần xử lý hôm nay', 'Needs attention today'],
  ['Các đầu việc vận hành cần chú ý', 'Operational items that need attention'],
  ['Toàn thời gian', 'All time'],
  ['Loại phòng', 'Room type'],
  ['Giá trị đặt phòng', 'Booking value'],
  ['Ngày', 'Date'],
  ['Đã đặt', 'Booked'],
  ['Mã booking', 'Booking code'],
  ['Khách hàng', 'Customer'],
  ['Ngày tạo', 'Created on'],
  ['Tổng tiền', 'Total amount'],
  ['Tỷ lệ trạng thái booking', 'Booking status distribution'],
  ['Tỷ lệ trạng thái trên toàn hệ thống', 'Status share across the system'],
  ['Nhóm số liệu thống kê', 'Statistics group'],
  ['Chưa có dữ liệu', 'No data yet'],
  ['Chưa có dữ liệu đặt phòng trong kỳ.', 'No booking data for this period.'],
  ['Chưa có dữ liệu trạng thái.', 'No status data yet.'],
  ['Chưa có phòng đang mở bán.', 'No rooms are currently available for sale.'],
  ['Chưa có booking nào.', 'No bookings yet.'],
  ['Chưa có dữ liệu kỳ trước', 'No data for the previous period'],
  [
    'Chưa có doanh thu đã thu trong khoảng thời gian này.',
    'No collected revenue in this period.',
  ],
  [
    'Chưa có booking hoặc đêm phòng trong khoảng thời gian này.',
    'No bookings or room nights in this period.',
  ],
  [
    'Không thể tải bức tranh kinh doanh. Vui lòng thử lại.',
    'Unable to load the business overview. Please try again.',
  ],
  [
    'Không thể tải thống kê phòng. Vui lòng thử lại.',
    'Unable to load room statistics. Please try again.',
  ],
  ['Không thể tải công suất phòng.', 'Unable to load room occupancy.'],
  ['Đang tải khoảng thời gian…', 'Loading period…'],
  ['Đang kiểm tra tình trạng phòng…', 'Checking room status…'],

  ['Chờ xác nhận', 'Pending confirmation'],
  ['Đã xác nhận', 'Confirmed'],
  ['Đã hủy', 'Cancelled'],
  ['Đã hoàn thành', 'Completed'],
  ['Hoàn thành', 'Completed'],
  ['Chưa thanh toán', 'Unpaid'],
  ['Đang xử lý', 'Processing'],
  ['Đã đặt cọc 50%', '50% deposit paid'],
  ['Đã thanh toán', 'Paid'],
  ['Thanh toán lỗi', 'Payment failed'],
  ['Đã hoàn tiền', 'Refunded'],
  ['Khác', 'Other'],
  ['Cần xử lý', 'Needs attention'],
  ['Booking mới cần xử lý', 'New booking needs attention'],
  ['Phòng đã được giữ cho khách', 'Room held for guest'],
  ['Không còn giữ phòng', 'Room is no longer held'],
  ['Khách đã kết thúc lưu trú', 'Guest completed the stay'],
  ['Đang chờ kết quả thanh toán', 'Waiting for payment result'],
  ['Giao dịch không thành công', 'Transaction failed'],
  ['Khoản tiền đã được hoàn lại', 'Payment has been refunded'],
  ['Chưa ghi nhận giao dịch', 'No transaction recorded'],
  [
    'Đã thu cọc, còn thu phần còn lại tại resort',
    'Deposit collected; balance due at resort',
  ],
  [
    'Đã thu đủ tiền, gồm khoản còn lại tại resort',
    'Payment collected in full, including resort balance',
  ],
  ['Còn thu khi khách đến', 'Due when guest arrives'],
  ['Còn lại theo booking', 'Remaining booking balance'],
  ['Trạng thái booking', 'Booking status'],
  ['Trạng thái thanh toán', 'Payment status'],
  ['Lưu trạng thái', 'Save status'],
  ['Đang cập nhật…', 'Updating…'],
  ['Đóng chi tiết booking', 'Close booking details'],
  ['Tạm tính', 'Subtotal'],
  ['Giảm giá', 'Discount'],
  ['Phí dịch vụ', 'Service charge'],
  ['Thuế', 'Tax'],
  ['Tổng thanh toán', 'Total payment'],
  ['Tiền cọc 50%', '50% deposit'],
  ['Đã thu', 'Collected'],
  ['Sau 15:00', 'After 3:00 PM'],

  ['Trong khoảng đang xem', 'Within the displayed period'],
  [
    'Gồm phòng đang giữ, không gồm đã hủy',
    'Includes held rooms and excludes cancellations',
  ],
  ['Khách nhận phòng', 'Guest check-in'],
  [
    'Lịch hiển thị 500 booking đầu tiên',
    'Calendar shows the first 500 bookings',
  ],
  ['Tìm booking', 'Search bookings'],
  [
    'Tìm mã booking, khách hoặc phòng...',
    'Search booking code, guest or room…',
  ],
  ['Xem khoảng thời gian trước', 'View previous period'],
  ['Xem khoảng thời gian sau', 'View next period'],
  ['Thứ 2', 'Mon'],
  ['Thứ 3', 'Tue'],
  ['Thứ 4', 'Wed'],
  ['Thứ 5', 'Thu'],
  ['Thứ 6', 'Fri'],
  ['Thứ 7', 'Sat'],
  ['CN', 'Sun'],
  ['Sơ đồ lưu trú', 'Stay timeline'],
  ['Lịch đặt phòng', 'Booking calendar'],
  [
    'Theo dõi phòng đã đặt theo thời gian. Nhấn vào một booking để xem chi tiết và cập nhật trạng thái.',
    'Track booked rooms over time. Select a booking to view details and update its status.',
  ],
  ['Ngày bắt đầu', 'Start date'],
  ['Số ngày muốn xem', 'Days to display'],
  ['Áp dụng', 'Apply'],
  [
    'Số phòng trống và đã đặt tính trên toàn bộ booking trong kỳ, không theo ô tìm kiếm.',
    'Available and booked room totals use all bookings in the period, regardless of the search filter.',
  ],
  ['Không thể tải số phòng trống.', 'Unable to load room availability.'],
  [
    'Vuốt ngang để xem thêm ngày trong timeline.',
    'Swipe horizontally to view more dates in the timeline.',
  ],
  ['Không thể tải lịch booking', 'Unable to load the booking calendar'],
  [
    'Không tìm thấy phòng hoặc booking phù hợp',
    'No matching rooms or bookings found',
  ],
  [
    'Hãy đổi khoảng ngày hoặc từ khóa tìm kiếm.',
    'Try a different date range or search term.',
  ],

  [
    'Tạo mới, chỉnh sửa giá, số lượng và trạng thái phòng.',
    'Create rooms and edit pricing, inventory and status.',
  ],
  ['Tìm phòng', 'Search rooms'],
  ['Tìm tên phòng, loại giường', 'Search room name or bed type'],
  ['Thêm phòng', 'Add room'],
  ['+ Thêm phòng', '+ Add room'],
  ['Không thể tải phòng.', 'Unable to load rooms.'],
  ['Không tìm thấy phòng.', 'No rooms found.'],
  ['Giá/đêm', 'Price/night'],
  ['Giá mỗi đêm', 'Price per night'],
  ['Sức chứa', 'Capacity'],
  ['Số lượng', 'Quantity'],
  ['Trạng thái', 'Status'],
  ['Thao tác', 'Actions'],
  ['Đang mở bán', 'Available'],
  ['Bảo trì', 'Maintenance'],
  ['Ngừng hoạt động', 'Inactive'],
  ['Chỉnh sửa', 'Edit'],
  ['Xóa', 'Delete'],
  ['Loại giường', 'Bed type'],
  ['Diện tích', 'Area'],
  ['Phòng tắm', 'Bathroom'],
  ['Lò sưởi', 'Fireplace'],
  ['Tầm nhìn', 'View'],
  ['phòng', 'rooms'],
  ['khách', 'guests'],
  ['Tên phòng', 'Room name'],
  ['Giá mỗi đêm (VND)', 'Price per night (VND)'],
  ['Diện tích (m²)', 'Area (m²)'],
  ['Tổng số phòng', 'Total rooms'],
  ['Ảnh đại diện (tối thiểu 1600×900px)', 'Cover image (minimum 1600×900px)'],
  [
    'Ảnh chi tiết (tối đa 5, tối thiểu 1600×900px)',
    'Detail images (up to 5, minimum 1600×900px)',
  ],

  ['Tạo phòng', 'Create room'],
  ['Thêm phòng mới', 'Add new room'],
  ['Chỉnh sửa phòng', 'Edit room'],
  [
    'Cập nhật thông tin và trạng thái phòng.',
    'Update room information and status.',
  ],
  ['Vui lòng nhập tên phòng.', 'Please enter a room name.'],
  ['Vui lòng nhập loại giường.', 'Please enter a bed type.'],
  [
    'Vui lòng chọn ảnh đại diện cho phòng.',
    'Please select a room cover image.',
  ],
  [
    'Mô tả cần ít nhất 10 ký tự.',
    'Description must be at least 10 characters.',
  ],
  ['Giá không hợp lệ.', 'Invalid price.'],
  ['Sức chứa không hợp lệ.', 'Invalid capacity.'],
  ['Số lượng không hợp lệ.', 'Invalid quantity.'],
  ['Diện tích không hợp lệ.', 'Invalid area.'],
  ['Mô tả chi tiết phòng', 'Detailed room description'],
  ['Ví dụ: Deluxe Mountain View', 'Example: Deluxe Mountain View'],
  [
    'Ảnh sẽ được tải lên Cloudinary qua API hiện có.',
    'Images will be uploaded to Cloudinary through the existing API.',
  ],
  ['Không thể đọc kích thước ảnh.', 'Unable to read image dimensions.'],
  [
    'Chỉ được chọn tối đa 5 ảnh chi tiết.',
    'You can select up to 5 detail images.',
  ],
  ['Đang lưu…', 'Saving…'],
  ['Lưu thay đổi', 'Save changes'],

  [
    'Tạo, chỉnh sửa, sắp xếp và ẩn hiện tour trên website.',
    'Create, edit, order and show or hide tours on the website.',
  ],
  ['Tìm tour', 'Search tours'],
  ['Tìm tên, thời lượng, độ khó', 'Search name, duration or difficulty'],
  ['Thêm tour', 'Add tour'],
  ['+ Thêm tour', '+ Add tour'],
  ['Đang tải tour…', 'Loading tours…'],
  ['Không thể tải danh sách tour.', 'Unable to load tours.'],
  ['Không tìm thấy tour.', 'No tours found.'],
  ['Thời lượng', 'Duration'],
  ['Độ khó', 'Difficulty'],
  ['Thứ tự', 'Order'],
  ['Thứ tự hiển thị', 'Display order'],
  ['Nhãn ngắn', 'Short label'],
  ['Đang hiển thị', 'Visible'],
  ['Đang ẩn', 'Hidden'],
  ['Tạo tour', 'Create tour'],
  ['Thêm tour mới', 'Add new tour'],
  ['Chỉnh sửa tour', 'Edit tour'],
  ['Vui lòng nhập tên tour.', 'Please enter a tour name.'],
  ['Vui lòng nhập nhãn ngắn.', 'Please enter a short label.'],
  ['Vui lòng nhập thời lượng.', 'Please enter a duration.'],
  ['Vui lòng nhập độ khó.', 'Please enter a difficulty.'],
  [
    'Vui lòng nhập ít nhất một điểm nổi bật.',
    'Please enter at least one highlight.',
  ],
  ['Vui lòng chọn ảnh đại diện cho tour.', 'Please select a tour cover image.'],
  ['Thứ tự không hợp lệ.', 'Invalid display order.'],
  ['Chỉ được nhập tối đa 8 điểm nổi bật.', 'You can enter up to 8 highlights.'],
  [
    'Mô tả hành trình và trải nghiệm chính',
    'Journey description and main experience',
  ],
  ['Ví dụ: 5–8 giờ', 'Example: 5–8 hours'],
  ['Ví dụ: Trung bình', 'Example: Moderate'],
  ['Đóng biểu mẫu', 'Close form'],
  ['Tên tour', 'Tour name'],
  ['Độ khó / nhịp', 'Difficulty / pace'],
  [
    'Điểm nổi bật (mỗi dòng một mục, tối đa 8)',
    'Highlights (one per line, up to 8)',
  ],
  ['Ảnh đại diện', 'Cover image'],
  [
    'Nội dung đang hoạt động sẽ xuất hiện trên trang Tours.',
    'Active content will appear on the Tours page.',
  ],
  [
    'Ví dụ: Hau Chu Ngai Highland Trail',
    'Example: Hau Chu Ngai Highland Trail',
  ],
  [
    'Ví dụ: Remote paths & mountain villages',
    'Example: Remote paths & mountain villages',
  ],
  [
    'Rừng tre và đường mòn Thác Cầu Mây Bản Giàng Tả Chải',
    'Bamboo forest and trails through Cau May Waterfall and Giang Ta Chai Village',
  ],

  [
    'Chỉnh sửa thông tin, phân quyền, khóa hoặc xóa tài khoản.',
    'Edit information and manage permissions, locks or deletion.',
  ],
  ['Tìm người dùng', 'Search users'],
  ['Tìm tên, email, số điện thoại', 'Search name, email or phone'],
  ['Không thể tải người dùng.', 'Unable to load users.'],
  ['Không tìm thấy người dùng.', 'No users found.'],
  ['Số điện thoại', 'Phone number'],
  ['Vai trò', 'Role'],
  ['Quản trị viên', 'Administrator'],
  ['Hoạt động', 'Active'],
  ['Đã khóa', 'Locked'],
  ['Cập nhật lần cuối', 'Last updated'],
  ['Vai trò hiện tại', 'Current role'],
  ['Trạng thái hiện tại', 'Current status'],
  ['Có thể để trống', 'Optional'],
  ['Họ tên cần ít nhất 2 ký tự.', 'Full name must be at least 2 characters.'],
  [
    'Họ tên không được quá 100 ký tự.',
    'Full name cannot exceed 100 characters.',
  ],
  ['Email không đúng định dạng.', 'Invalid email address.'],
  ['Email không được quá 254 ký tự.', 'Email cannot exceed 254 characters.'],
  [
    'Số điện thoại không được quá 30 ký tự.',
    'Phone number cannot exceed 30 characters.',
  ],
  ['Đóng biểu mẫu chỉnh sửa người dùng', 'Close user edit form'],
  ['Chỉnh sửa người dùng', 'Edit user'],
  [
    'Cập nhật thông tin tài khoản, quyền và trạng thái hoạt động.',
    'Update account information, role and status.',
  ],
  ['Họ và tên', 'Full name'],
  ['Bạn', 'You'],
  [
    'Đây là tài khoản bạn đang sử dụng. Bạn có thể sửa thông tin liên hệ, nhưng không thể tự hạ quyền hoặc tự khóa tài khoản.',
    'This is the account you are using. You can edit contact information, but you cannot lower your own role or lock your account.',
  ],

  [
    'Quản lý mã ưu đãi, thời gian áp dụng và số lượt còn lại.',
    'Manage promotion codes, active dates and remaining uses.',
  ],
  ['Tìm voucher', 'Search vouchers'],
  ['Tìm theo mã voucher', 'Search by voucher code'],
  ['Thêm voucher', 'Add voucher'],
  ['+ Thêm voucher', '+ Add voucher'],
  ['Không thể tải danh sách voucher.', 'Unable to load vouchers.'],
  ['Không tìm thấy voucher.', 'No vouchers found.'],
  ['Mã voucher', 'Voucher code'],
  ['Mức giảm', 'Discount'],
  ['Còn lại', 'Remaining'],
  ['Thời gian áp dụng', 'Active period'],
  ['Bắt đầu', 'Starts'],
  ['Kết thúc', 'Ends'],
  ['Đang áp dụng', 'Active'],
  ['Đã tắt', 'Disabled'],
  ['Hết lượt', 'No uses left'],
  ['Sắp diễn ra', 'Upcoming'],
  ['Hết hạn', 'Expired'],
  ['Số lượt còn lại', 'Uses remaining'],
  ['Tạo voucher', 'Create voucher'],
  ['Thêm voucher mới', 'Add new voucher'],
  ['Chỉnh sửa voucher', 'Edit voucher'],
  ['Vui lòng nhập mã voucher.', 'Please enter a voucher code.'],
  ['Vui lòng chọn ngày bắt đầu.', 'Please select a start date.'],
  ['Vui lòng chọn ngày kết thúc.', 'Please select an end date.'],
  [
    'Ngày kết thúc phải từ ngày bắt đầu trở đi.',
    'End date must be on or after the start date.',
  ],
  ['Giá trị giảm phải lớn hơn 0.', 'Discount value must be greater than 0.'],
  [
    'Phần trăm giảm không được lớn hơn 100%.',
    'Discount percentage cannot exceed 100%.',
  ],
  ['Số lượt sử dụng không hợp lệ.', 'Invalid usage limit.'],
  ['Mức giảm (%)', 'Discount (%)'],
  ['Mức giảm (VND)', 'Discount (VND)'],
  ['Theo phần trăm', 'By percentage'],
  ['Theo số tiền', 'By amount'],
  ['Đang bật', 'Enabled'],
  ['Đóng', 'Close'],
  ['Ví dụ: SUMMER20', 'Example: SUMMER20'],
  ['Loại giảm giá', 'Discount type'],
  ['Số lượt sử dụng', 'Usage limit'],
  ['Ngày kết thúc', 'End date'],
  [
    'Thiết lập mức giảm, số lượt sử dụng và thời gian áp dụng.',
    'Set the discount, usage limit and active period.',
  ],

  [
    'Quản lý nội dung, hình ảnh và dịch vụ hiển thị trên website.',
    'Manage content, images and services shown on the website.',
  ],
  ['Nội dung Dining', 'Dining content'],
  ['Nội dung Spa', 'Spa content'],
  ['Dịch vụ', 'Services'],
  ['Tìm dịch vụ...', 'Search services…'],
  ['Đang tải dữ liệu…', 'Loading data…'],
  ['Không thể tải dữ liệu Dining.', 'Unable to load Dining data.'],
  ['Không thể tải dữ liệu Spa.', 'Unable to load Spa data.'],
  ['Không tìm thấy dữ liệu.', 'No data found.'],
  ['Ngày tạo', 'Created on'],
  ['Lưu nội dung', 'Save content'],
  ['+ Thêm Dining', '+ Add Dining'],
  ['+ Thêm Spa', '+ Add Spa'],
  ['+ Thêm dịch vụ', '+ Add service'],
  ['Vui lòng nhập tiêu đề.', 'Please enter a title.'],
  ['Vui lòng chọn ảnh đại diện.', 'Please select a cover image.'],
  ['(chọn để thay thế)', '(select to replace)'],
  ['(không bắt buộc)', '(optional)'],
  ['Tên dịch vụ', 'Service name'],
  [
    'Thời gian, nội dung hoặc thông tin dịch vụ',
    'Time, content or service information',
  ],
  ['Vui lòng chọn nội dung cha.', 'Please select parent content.'],
  ['Vui lòng nhập tên dịch vụ.', 'Please enter a service name.'],
  ['Vui lòng nhập mô tả.', 'Please enter a description.'],
  ['Vui lòng chọn icon dịch vụ.', 'Please select a service icon.'],
  ['Chỉnh sửa dịch vụ', 'Edit service'],
  ['Lưu dịch vụ', 'Save service'],
  [
    'Dữ liệu và hình ảnh sẽ được lưu qua API hiện có.',
    'Data and images will be saved through the existing API.',
  ],
  ['Tiêu đề', 'Title'],
  ['Ảnh chi tiết, tối đa 5', 'Detail images, up to 5'],
  ['Thuộc nội dung', 'Belongs to content'],
  ['Service sẽ hiển thị trên trang', 'The service will appear on the'],
  ['tương ứng.', 'page.'],
  ['Đang tải dịch vụ…', 'Loading services…'],
  ['Không thể tải dịch vụ.', 'Unable to load services.'],
  ['Không thể tải dữ liệu', 'Unable to load data'],
  ['Chưa có nội dung', 'No content yet'],
  ['Chưa có dịch vụ', 'No services yet'],

  ['Chi tiết', 'Details'],
  ['Mô tả', 'Description'],
  ['Điểm nổi bật', 'Highlights'],
  ['Hình ảnh', 'Images'],
  ['Thử lại', 'Try again'],
  ['Tìm kiếm', 'Search'],
  ['Lưu', 'Save'],
  ['Hủy', 'Cancel'],
  ['Thêm', 'Add'],
  ['+ Thêm', '+ Add'],
  ['Quản lý', 'Manage'],
  ['Nội dung', 'Content'],
  ['Thuộc', 'Belongs to'],
  ['người dùng', 'user'],
  ['loại phòng', 'room types'],
  ['phòng mở bán', 'rooms for sale'],
  ['ngày', 'days'],
  ['đêm', 'nights'],
  ['đêm ×', 'nights ×'],
  ['phòng ×', 'rooms ×'],
  ['lượt', 'uses'],
  ['đến', 'to'],
  ['Tổng', 'Total'],
  ['Chi tiết booking', 'Booking details'],
  ['Tạo lúc', 'Created at'],
  ['Nhận phòng', 'Check-in'],
  ['Trả phòng', 'Check-out'],
  ['Thông tin khách hàng', 'Guest information'],
  ['Họ tên liên hệ', 'Contact name'],
  ['Tài khoản', 'Account'],
  ['Tài khoản đã xóa', 'Deleted account'],
  ['Điện thoại', 'Phone'],
  ['Ghi chú', 'Notes'],
  ['Phòng đã đặt', 'Booked rooms'],
  ['Phòng đã xóa', 'Deleted room'],
  ['Thanh toán', 'Payment'],
  ['Phương thức:', 'Method:'],
  ['Cập nhật trạng thái', 'Update status'],
  ['Active', 'Active'],
  ['Inactive', 'Inactive'],
  ['Available', 'Available'],
  ['Maintenance', 'Maintenance'],
  ['User', 'User'],
  ['Admin', 'Admin'],

  ['Đã tạo phòng.', 'Room created.'],
  ['Đã cập nhật phòng.', 'Room updated.'],
  ['Đã xóa phòng.', 'Room deleted.'],
  ['Đã tạo tour.', 'Tour created.'],
  ['Đã cập nhật tour.', 'Tour updated.'],
  ['Đã xóa tour.', 'Tour deleted.'],
  ['Đã cập nhật người dùng.', 'User updated.'],
  ['Đã xóa người dùng.', 'User deleted.'],
  ['Đã tạo voucher.', 'Voucher created.'],
  ['Đã cập nhật voucher.', 'Voucher updated.'],
  ['Đã xóa voucher.', 'Voucher deleted.'],
  ['Đã cập nhật booking.', 'Booking updated.'],
  ['Đã tạo Dining.', 'Dining content created.'],
  ['Đã tạo Spa.', 'Spa content created.'],
  ['Đã cập nhật nội dung.', 'Content updated.'],
  ['Đã xóa nội dung.', 'Content deleted.'],
  ['Đã tạo dịch vụ.', 'Service created.'],
  ['Đã cập nhật dịch vụ.', 'Service updated.'],
  ['Đã xóa dịch vụ.', 'Service deleted.'],
  ['Không thể thực hiện thao tác.', 'Unable to complete this action.'],
] as const;

const BY_VI = new Map(PAIRS.map(([vi, en]) => [vi, en]));
const BY_EN = new Map<string, string>();
for (const [vi, en] of PAIRS) {
  if (!BY_EN.has(en)) BY_EN.set(en, vi);
}
const ATTRIBUTES = ['aria-label', 'placeholder', 'title'] as const;

function preserveWhitespace(source: string, translated: string) {
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function translateDynamic(value: string, locale: string) {
  if (locale === 'en') {
    return value
      .replace(/^Chi tiết (.+)$/u, 'Details: $1')
      .replace(/^Đóng chi tiết (.+)$/u, 'Close $1 details')
      .replace(/^Quản lý (.+)$/u, 'Manage $1')
      .replace(/^Tìm nội dung (.+)\.\.\.$/u, 'Search $1 content…')
      .replace(/^Không thể tải dữ liệu (.+)\.$/u, 'Unable to load $1 data.')
      .replace(/^Đang tải (.+)…$/u, 'Loading $1…')
      .replace(/^(\d+) khách$/u, '$1 guests')
      .replace(/^(\d+) phòng$/u, '$1 rooms')
      .replace(/^(\d+) lượt$/u, '$1 uses')
      .replace(/^đến (.+)$/u, 'to $1')
      .replace(
        /^Xóa phòng “(.+)”\? Phòng có lịch sử booking sẽ được hệ thống từ chối xóa\.$/u,
        'Delete room “$1”? The system will reject deletion if the room has booking history.'
      )
      .replace(/^Xóa tour “(.+)”\?$/u, 'Delete tour “$1”?')
      .replace(
        /^Xóa người dùng “(.+)”\? Tài khoản có lịch sử booking sẽ không thể xóa\.$/u,
        'Delete user “$1”? Accounts with booking history cannot be deleted.'
      )
      .replace(
        /^Xóa voucher “(.+)”\? Voucher đã được dùng trong booking sẽ không thể xóa\.$/u,
        'Delete voucher “$1”? Vouchers used in bookings cannot be deleted.'
      )
      .replace(
        /^Xóa “(.+)”\? Bạn cần xóa các dịch vụ trực thuộc trước\.$/u,
        'Delete “$1”? You must delete its services first.'
      )
      .replace(/^Xóa dịch vụ “(.+)”\?$/u, 'Delete service “$1”?');
  }

  return value
    .replace(/^Details: (.+)$/u, 'Chi tiết $1')
    .replace(/^Close (.+) details$/u, 'Đóng chi tiết $1')
    .replace(/^Manage (.+)$/u, 'Quản lý $1')
    .replace(/^Search (.+) content…$/u, 'Tìm nội dung $1...')
    .replace(/^Unable to load (.+) data\.$/u, 'Không thể tải dữ liệu $1.')
    .replace(/^Loading (.+)…$/u, 'Đang tải $1…')
    .replace(/^(\d+) guests$/u, '$1 khách')
    .replace(/^(\d+) rooms$/u, '$1 phòng')
    .replace(/^(\d+) uses$/u, '$1 lượt')
    .replace(/^to (.+)$/u, 'đến $1');
}

function translateValue(source: string, locale: string) {
  const trimmed = source.trim();
  if (!trimmed) return source;

  const normalized = trimmed.replace(/\s+/gu, ' ');
  const exact = locale === 'en' ? BY_VI.get(normalized) : BY_EN.get(normalized);
  const translated = exact ?? translateDynamic(normalized, locale);
  return translated === normalized
    ? source
    : preserveWhitespace(source, translated);
}

function translateTree(root: Node, locale: string) {
  if (root.nodeType === Node.TEXT_NODE) {
    const value = root.nodeValue ?? '';
    const translated = translateValue(value, locale);
    if (translated !== value) root.nodeValue = translated;
    return;
  }

  if (!(root instanceof Element)) return;

  for (const attribute of ATTRIBUTES) {
    const value = root.getAttribute(attribute);
    if (!value) continue;
    const translated = translateValue(value, locale);
    if (translated !== value) root.setAttribute(attribute, translated);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue ?? '';
    const translated = translateValue(value, locale);
    if (translated !== value) node.nodeValue = translated;
    node = walker.nextNode();
  }

  root.querySelectorAll('*').forEach((element) => {
    for (const attribute of ATTRIBUTES) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const translated = translateValue(value, locale);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  });
}

export function AdminLocalizationBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const locale = useLocale();

  useLayoutEffect(() => {
    translateTree(document.body, locale);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => translateTree(node, locale));
        if (mutation.type === 'characterData')
          translateTree(mutation.target, locale);
        if (mutation.type === 'attributes')
          translateTree(mutation.target, locale);
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...ATTRIBUTES],
    });

    const originalConfirm = window.confirm;
    const originalAlert = window.alert;
    window.confirm = (message) =>
      originalConfirm(translateValue(String(message ?? ''), locale));
    window.alert = (message) =>
      originalAlert(translateValue(String(message), locale));

    return () => {
      observer.disconnect();
      window.confirm = originalConfirm;
      window.alert = originalAlert;
    };
  }, [locale]);

  return <>{children}</>;
}
