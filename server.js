const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// خدمة الملفات الثابتة من المجلد الرئيسي
app.use(express.static(path.join(__dirname, './')));

// توجيه الصفحة الرئيسية إلى index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// المجموعات والمسارات المصممة بنمط Englify
let groups = [
    {
        id: 1,
        title: "المحادثة والتواصل - المجموعات الصغرى (Max 6)",
        level: "جميع المستويات (A1 - C1)",
        type: "مجموعة مصغرة",
        schedule: "مرن (مرتان في الأسبوع)",
        price: "350 درهم / شهرياً",
        seatsLeft: 4
    },
    {
        id: 2,
        title: "الدروس الفردية المباشرة (1-on-1 Private)",
        level: "مخصص حسب حاجتك",
        type: "دروس خاصة",
        schedule: "أوقات تختارها أنت",
        price: "700 درهم / شهرياً",
        seatsLeft: 2
    },
    {
        id: 3,
        title: "إنجليزية الأعمال والمهنيين (Business English)",
        level: "متوسط إلى متقدم",
        type: "مجموعة مهنية",
        schedule: "نهاية الأسبوع / مسائي",
        price: "500 درهم / شهرياً",
        seatsLeft: 5
    }
];

// قواعد بيانات الطلبات
let trialRequests = [];
let bookings = [];

// APIs
app.get('/api/groups', (req, res) => res.json(groups));

// طلب حصة تجريبية مجانية
app.post('/api/trial', (req, res) => {
    const { name, phone, level, target } = req.body;
    const newTrial = {
        id: 'TRL-' + Math.floor(100000 + Math.random() * 900000),
        name,
        phone,
        level: level || 'غير محدد',
        target: target || 'عام',
        status: 'جديد',
        date: new Date().toLocaleDateString('ar-MA')
    };
    trialRequests.push(newTrial);
    res.json({ success: true, message: 'تم تسجيل طلبك للحصة التجريبية بنجاح!' });
});

// حجز مجموعة مباشرة مع الوصل
app.post('/api/groups/book', (req, res) => {
    const { groupId, name, email, phone, paymentReceipt } = req.body;
    const group = groups.find(g => g.id == groupId);
    if (!group) return res.status(400).json({ success: false, message: 'المجموعة غير موجودة' });

    if (group.seatsLeft > 0) group.seatsLeft -= 1;

    const newBooking = {
        id: 'LLE-' + Math.floor(100000 + Math.random() * 900000),
        groupId: group.id,
        groupTitle: group.title,
        name,
        email,
        phone,
        paymentReceipt,
        status: 'قيد التحقق',
        date: new Date().toLocaleDateString('ar-MA')
    };

    bookings.push(newBooking);
    res.json({ success: true, bookingId: newBooking.id });
});

// لوحة الإدارة
app.get('/api/admin/data', (req, res) => {
    res.json({ bookings, trialRequests });
});

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 LinguaLeap v2.0 - Operating System Running!`);
    console.log(`🌐 Public Website: http://localhost:${PORT}`);
    console.log(`🔐 Admin Portal: http://localhost:${PORT}/admin.html`);
    console.log(`=================================`);
});
module.exports = app;
