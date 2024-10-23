# auth-service/Dockerfile
FROM node:20

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép tất cả mã nguồn còn lại vào image
COPY . .

# Thiết lập biến môi trường (nếu cần thiết)
ENV PORT=3000

# Mở cổng cho ứng dụng
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "src/index.js"]
