// ============================================================
// ANNA SITE DATA
// ============================================================
// Chi sua noi dung website tai file nay.
// Neu ban muon doi text, san pham, banner, footer, about, contact...
// thi KHONG can sua app.js.
//
// Cac nhom du lieu chinh:
// - meta: title, description
// - theme: hinh anh hero, mau sac co the mo rong sau
// - products: danh sach san pham
// - banners: slider hero trang chu
// - loadingWords: text splash loading
// - modalViews: cac nut goc xem trong modal san pham
// - footer: noi dung footer dung chung tat ca page
// - home: noi dung section co dinh tren trang chu
// - aboutPage: noi dung trang Ve Anna
// - contactPage: noi dung trang Lien he
// ============================================================

window.ANNA_SITE_DATA = {
  // ----------------------------------------------------------
  // META TOAN WEBSITE
  // ----------------------------------------------------------
  meta: {
    title: "Anna Eyewear | Kính mắt thời trang cao cấp",
    description:
      "Anna Eyewear | Thương hiệu kính mắt thời trang với thiết kế tinh tế, hiện đại và cá tính dành cho phong cách sống trẻ.",
  },

  // ----------------------------------------------------------
  // HINH ANH / THEME CHUNG
  // ----------------------------------------------------------
  theme: {
    heroImage:
      "assets/images/hero-image.png",
  },

  // ----------------------------------------------------------
  // DANH SACH SAN PHAM
  // image: duong dan anh san pham
  // style: nhan ngan hien tren card
  // material: chat lieu hien trong card/modal
  // ----------------------------------------------------------
  products: [
    { 
      id: "TR27075", 
      name: "GỌNG KÍNH THỜI TRANG TR27075", 
      price: 450000, 
      image: "assets/images/TR27075.jpg", 
      description: "Được thiết kế hiện đại, tinh giản và thanh lịch, dễ ứng dụng với nhiều dáng khuôn mặt. Dễ dàng lắp được tròng kính cận, viễn, loạn.", 
      material: "Chất liệu nhẹ, bền", 
      style: "Hiện đại" 
    },
    { 
      id: "S01010", 
      name: "GỌNG KÍNH THỜI TRANG S01010", 
      price: 450000, 
      image: "assets/images/S01010.jpg", 
      description: "Phong cách tối giản, tinh tế, phù hợp cho nhu cầu thay tròng để học tập, làm việc hằng ngày. Form dáng cân đối, tự nhiên.", 
      material: "Chất liệu nhẹ, chắc chắn", 
      style: "Tối giản" 
    },
    { 
      id: "110049", 
      name: "GK. GỌNG KÍNH THỜI TRANG 110049", 
      price: 450000, 
      image: "assets/images/110049.jpg", 
      description: "Gọng kính thời trang, thiết kế trẻ trung. Trọng lượng nhẹ, giúp thoải mái khi đeo cả ngày dài. Kích thước: 53-17-148 (mm)", 
      material: "Nhựa dẻo + Kim loại", 
      style: "Trẻ trung" 
    },
    { 
      id: "110048", 
      name: "GK. GỌNG KÍNH THỜI TRANG 110048", 
      price: 450000, 
      image: "assets/images/110048.jpg", 
      description: "Sang trọng, hiện đại với đường nét thanh thoát. Bản lề linh hoạt, độ bền cao. Kích thước: 53-17-148 (mm)", 
      material: "Nhựa dẻo + Kim loại", 
      style: "Thanh thoát" 
    },
    { 
      id: "YC1270", 
      name: "GK. GỌNG KÍNH DẺO YC1270", 
      price: 450000, 
      image: "assets/images/YC1270.jpg", 
      description: "Siêu nhẹ, linh hoạt và chống va đập cực tốt, mang đến sự thoải mái tối đa khi đeo. Kích thước: 52-18-148 (mm)", 
      material: "Nhựa dẻo cao cấp", 
      style: "Thanh lịch" 
    },
    { 
      id: "NA240", 
      name: "GK. GỌNG NHỰA CỨNG KIM LOẠI NA240", 
      price: 450000, 
      image: "assets/images/NA240.jpg", 
      description: "Sự kết hợp hoàn hảo giữa chất liệu nhựa cứng chịu va đập và càng kim loại chắc chắn giúp tạo độ bền bỉ cao. Chiều rộng tròng: 55mm", 
      material: "Nhựa cứng + Kim loại", 
      style: "Hiện đại" 
    },
    {
      id: "P8013",
      name: "GK. GỌNG KÍNH THỜI TRANG ĐEN P8013",
      price: 450000,
      image: "assets/images/P8013.jpg",
      description: "Dáng Cat-eye cổ điển màu đen huyền bí, sắc sảo. Phù hợp làm kính cận, kính mát hoặc kính thời trang. Kích thước (Tròng-Cầu-Càng): 52-18-145 (mm)",
      material: "Acetate + Lõi kim loại",
      style: "Cá tính"
    },
    {
      id: "S11916",
      name: "GK. GỌNG KÍNH THỜI TRANG NÂU DEMI S11916",
      price: 450000,
      image: "assets/images/S11916.jpg",
      description: "Dáng mắt mèo tinh tế, màu nâu trà trong suốt nữ tính. Form siêu nhẹ thanh thoát. Kích thước (Tròng-Cầu-Càng): 52-19-146 (mm)",
      material: "Nhựa dẻo + Viền kim loại",
      style: "Vintage"
    },
    {
      id: "228013",
      name: "GK. GỌNG MÈO NHỰA 228013 (51.18.143)",
      price: 350000,
      image: "assets/images/228013.jpg",
      description: "Thiết kế mắt mèo trẻ trung, phối màu trắng trong suốt mang lại vẻ ngoài thanh tú và hiện đại. Kích thước (Tròng-Cầu-Càng): 51-18-143 (mm)",
      material: "Nhựa trong suốt + Lõi kim loại",
      style: "Tối giản"
    },
    {
      id: "1111100049",
      name: "GK. GỌNG KÍNH THỜI TRANG 1111100049 (53.17.148)",
      price: 880000,
      image: "assets/images/1111100049.jpg",
      description: "Thuộc BST Keo Lỳ, phong cách Bold Cat-eye với đường viền dày dặn, đậm chất High-fashion. Kích thước (Tròng-Cầu-Càng): 53-17-148 (mm)",
      material: "Acetate nguyên khối + Lõi thép",
      style: "High-fashion"
    }
  ],

  // ----------------------------------------------------------
  // HERO BANNERS TRANG CHU
  // eyebrow: dong text nho phia tren
  // title: tieu de lon
  // sub: mo ta ngắn
  // ----------------------------------------------------------
  banners: [
    { eyebrow: "Bộ sưu tập 2026", title: "Kính mắt mèo Anna", sub: "Thiết kế mắt mèo thanh lịch, giúp tôn lên đường nét khuôn mặt và mang đến vẻ ngoài cá tính, hiện đại — phù hợp với phong cách của phụ nữ Việt Nam." },
    { eyebrow: "", title: "Một thiết kế – Nhiều phong cách", sub: "Dễ dàng kết hợp từ trang phục thường ngày đến những dịp đặc biệt, phù hợp với nhiều dáng khuôn mặt và phong cách sống năng động của giới trẻ." },
    { eyebrow: "", title: "Đơn giản nhưng đẳng cấp", sub: "Tối giản trong thiết kế nhưng tinh tế trong từng chi tiết, từ chất liệu đến hoàn thiện — mang lại cảm giác thoải mái và sang trọng khi sử dụng mỗi ngày." },
  ],

  // ----------------------------------------------------------
  // SPLASH LOADING TEXT
  // ----------------------------------------------------------
  loadingWords: ["Tinh tế", "Hiện đại", "Cá tính"],

  // ----------------------------------------------------------
  // NUT GOC XEM TRONG MODAL SAN PHAM
  // ----------------------------------------------------------
  modalViews: [
    { label: "Chính diện", transform: "rotate(0deg)" },
    { label: "Nghiêng trái", transform: "rotate(-15deg) scaleX(0.9)" },
    { label: "Nghiêng phải", transform: "rotate(15deg) scaleX(0.9)" },
    { label: "Cận chi tiết", transform: "scale(1.4)" },
  ],

  // ----------------------------------------------------------
  // FOOTER DUNG CHUNG
  // aboutText: mo ta thuong hieu o cot 1
  // exploreLinks: danh sach link cot "Kham pha"
  // contactItems: thong tin cot "Lien he"
  // socialLinks: de href="#" neu chua co link that
  // ----------------------------------------------------------
  footer: {
    brandText: "Anna Eyewear",
    aboutText:
      "Thương hiệu kính mắt thời trang dành cho giới trẻ Việt Nam. Thiết kế tối giản, chất lượng cao cấp, giá cả hợp lý — mỗi chiếc kính là một tuyên ngôn phong cách.",
    exploreTitle: "Khám phá",
    exploreLinks: [
      { label: "Trang chủ", href: "index.html" },
      { label: "Sản phẩm", href: "san-pham.html" },
      { label: "Về Anna", href: "ve-anna.html" },
    ],
    contactTitle: "Liên hệ",
    contactItems: ["marketing@kinhmatanna.com", "0941203457", "Số 194 Võ Văn Ngân, Phường Thủ Đức, Thành phố Hồ Chí Minh"],
    copyright: "© 2026 ANNA Eyewear. All rights reserved.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      tiktok: "#",
    },
  },

  // ----------------------------------------------------------
  // NOI DUNG TRANG CHU
  // ----------------------------------------------------------
  home: {
    aboutSection: {
      eyebrow: "Về Anna Eyewear",
      title: "Câu chuyện thương hiệu",
      intro:
        "ANNA là thương hiệu kính thời trang được thành lập với triết lý thiết kế tối giản, giá cả hợp lý và phù hợp với phong cách của giới trẻ Việt Nam. Mỗi chiếc kính đều được chế tác tỉ mỉ, mang đến vẻ đẹp tinh tế nhưng không kém phần cá tính.",
      values: [
        { title: "Sứ mệnh", description: "Mang đến vẻ đẹp tinh tế, hiện đại cho mọi người với mức giá phải chăng." },
        { title: "Tầm nhìn", description: "Trở thành thương hiệu kính phổ biến và được yêu thích nhất tại Việt Nam." },
        { title: "Giá trị cốt lõi", description: "Thiết kế tối giản · Chất lượng cao · Giá hợp lý." },
      ],
    },
    gallery: {
      eyebrow: "Sản phẩm thực tế",
      title: "Lookbook",
      items: [
        { alt: "ANNA Lookbook 1", caption: "ANNA Lookbook 1" },
        { alt: "ANNA Lookbook 2", caption: "ANNA Lookbook 2" },
        { alt: "ANNA Lookbook 3", caption: "ANNA Lookbook 3" },
        { alt: "ANNA Lookbook 4", caption: "ANNA Lookbook 4" },
        { alt: "ANNA Lookbook 5", caption: "ANNA Lookbook 5" },
        { alt: "ANNA Lookbook 6", caption: "ANNA Lookbook 6" },
      ],
    },
    stats: [
      { value: 10, suffix: "+", label: "Mẫu kính" },
      { value: 5000, suffix: "+", label: "Khách hàng" },
      { value: 98, suffix: "%", label: "Hài lòng" },
    ],
    contactSection: {
      title: "Liên hệ với ANNA ngay hôm nay",
      subtitle: "Chúng tôi luôn sẵn sàng hỗ trợ bạn với thông tin liên hệ, bảo hành và chính sách sau mua.",
      infoTitle: "Thông tin liên hệ",
      infoItems: ["marketing@kinhmatanna.com", "0941203457", "Số 194 Võ Văn Ngân, Phường Thủ Đức, Thành phố Hồ Chí Minh"],
      policyTitle: "Chính sách bảo hành",
      policyItems: ["Bảo hành 6 tháng", "Đổi trả 7 ngày nếu lỗi", "Hỗ trợ sửa chữa"],
      excludedTitle: "Không áp dụng bảo hành",
      excludedItems: ["Rơi vỡ", "Va đập"],
    },
  },

  // ----------------------------------------------------------
  // TRANG VE ANNA
  // ----------------------------------------------------------
  aboutPage: {
    hero: {
      eyebrow: "Về Anna Eyewear",
      title: "Câu chuyện thương hiệu",
      subtitle:
        "Anna là thương hiệu kính thời trang được thành lập với triết lý thiết kế tối giản, giá cả hợp lý và phù hợp với phong cách của giới trẻ Việt Nam.",
    },
    values: [
      { title: "Sứ mệnh", description: "Mang đến vẻ đẹp tinh tế, hiện đại cho mọi người với mức giá phải chăng." },
      { title: "Tầm nhìn", description: "Trở thành thương hiệu kính thời trang phổ biến và được yêu thích nhất tại Việt Nam." },
      { title: "Giá trị cốt lõi", description: "Thiết kế tối giản · Chất lượng · Tinh tế · Hiện đại." },
    ],
    story: {
      eyebrow: "Câu chuyện của chúng tôi",
      title: "Từ ý tưởng đến hiện thực",
      paragraphs: [
        "ANNA Eyewear bắt đầu từ một ý tưởng đơn giản: tạo ra những chiếc kính đẹp mà ai cũng có thể sở hữu.",
        "Mỗi thiết kế đều được nghiên cứu kỹ lưỡng để đảm bảo sự thoải mái và phong cách.",
      ],
    },
    timelineTitle: "Hành trình phát triển",
    timeline: [
      { year: "2024", text: "ANNA Eyewear ra đời tại TP. Hồ Chí Minh." },
      { year: "2025", text: "Ra mắt dòng kính mắt mèo đầu tiên — 10 thiết kế." },
      { year: "2026", text: "Phục vụ hơn 5.000 khách hàng trên toàn quốc." },
    ],
    benefitsTitle: "Tại sao chọn ANNA?",
    benefits: [
      "Thiết kế tối giản, phong cách Hàn Quốc",
      "Giá cả hợp lý cho giới trẻ",
      "Phù hợp mọi dáng khuôn mặt",
      "Bảo hành 6 tháng chính hãng",
      "Đổi trả miễn phí trong 7 ngày",
      "Hỗ trợ sửa chữa trọn đời",
    ],
  },

  // ----------------------------------------------------------
  // TRANG LIEN HE
  // ----------------------------------------------------------
  contactPage: {
    hero: {
      eyebrow: "Kết nối với chúng tôi",
      title: "Liên hệ Anna Eyewear",
      subtitle:
        "Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy chọn phương thức liên lạc phù hợp nhất.",
    },
    contactInfoTitle: "Thông tin liên hệ",
    hotline: "0941203457",
    email: "marketing@kinhmatanna.com",
    address: "Số 194 Võ Văn Ngân, Phường Thủ Đức, Thành phố Hồ Chí Minh",
    quickSupportTitle: "Hỗ trợ nhanh",
    quickSupportText:
      "Đội ngũ chăm sóc khách hàng trực tuyến sẵn sàng giải đáp thắc mắc của bạn từ 8:00 - 22:00 mỗi ngày.",
    quickSupportButton: "Chat qua Messenger",
    formTitle: "Gửi lời nhắn",
    formIntro:
      "Để lại thông tin và lời nhắn, chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.",
    formSuccessTitle: "Đã gửi thành công!",
    formSuccessText: "Cảm ơn bạn đã liên hệ.",
  },
};
