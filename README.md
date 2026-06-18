
# Interior Design — Updated Fullstack (No Docker)

This package contains an updated frontend (React + Tailwind) with an attractive theme, image slider, cart functionality, and enhanced admin UI.
Backend is Express + MySQL with cart/order endpoints.

## Steps to run (Non-Docker)

1. Ensure MySQL server is running and database `proj_int` exists.
2. Import DB schema:
   From command prompt (example path):
   mysql -u root -p proj_int < "C:\Users\Praveena\OneDrive\文件\Desktop\interior-design-project-main (1)\interior-design-project-main\backend\db\init.sql"

3. Backend:
   cd backend
   npm install
   npm run dev
   (Ensure backend/.env has your DB credentials — adjust if using root).

4. Frontend:
   cd frontend
   npm install
   npm run dev
   Open http://localhost:5173

## Notes
- Register users via the login page (choose role admin/client/user).
- Add to cart from the Designs page; view Cart and Checkout to create orders.
- Admin page: view Users and Orders (admin role required).
