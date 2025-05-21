# XYZLTD
A repository containing xyz ltd parking management



parking-management-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── parkingController.js
│   │   │   ├── carEntryController.js
│   │   │   └── reportController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── roleCheck.js
│   │   │   ├── errorHandler.js
│   │   │   └── logger.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── parkingRoutes.js
│   │   │   ├── carEntryRoutes.js
│   │   │   └── reportRoutes.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── parkingService.js
│   │   │   ├── carEntryService.js
│   │   │   ├── ticketService.js
│   │   │   └── reportService.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── README.md
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── assets/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── Pagination.jsx
    │   │   ├── auth/
    │   │   │   ├── LoginForm.jsx
    │   │   │   └── SignupForm.jsx
    │   │   ├── parking/
    │   │   │   ├── ParkingForm.jsx
    │   │   │   └── ParkingList.jsx
    │   │   ├── carEntry/
    │   │   │   ├── CarEntryForm.jsx
    │   │   │   └── CarEntryList.jsx
    │   │   └── reports/
    │   │       ├── OutgoingCarsReport.jsx
    │   │       └── EnteredCarsReport.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Signup.jsx
    │   │   ├── dashboard/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   └── AttendantDashboard.jsx
    │   │   ├── parking/
    │   │   │   ├── ParkingManagement.jsx
    │   │   │   └── ViewParkings.jsx
    │   │   ├── carEntry/
    │   │   │   ├── RegisterEntry.jsx
    │   │   │   └── RegisterExit.jsx
    │   │   ├── reports/
    │   │   │   └── Reports.jsx
    │   │   ├── NotFound.jsx
    │   │   └── Home.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── usePagination.js
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── parkingService.js
    │   │   ├── carEntryService.js
    │   │   └── reportService.js
    │   ├── utils/
    │   │   ├── formatters.js
    │   │   └── validators.js
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── routes.jsx
    ├── .env
    ├── package.json
    └── README.md