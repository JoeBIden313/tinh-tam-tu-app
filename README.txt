LAM FILE APK THAT (toan bo game nam trong app) - MIEN PHI

BUOC 1: Tao repo moi tren GitHub
- github.com -> New repository -> ten: tinh-tam-tu-app -> Public -> Create repository.

BUOC 2: Upload file (KHONG keo thu muc .github)
- Bam "uploading an existing file".
- Giai nen zip nay, keo vao: package.json, capacitor.config.json, debug.keystore,
  README.txt va cac thu muc: src, scripts, icons.
- Bam Commit changes.

BUOC 3: Tao file build (lam bang tay de khong bi sot thu muc an)
- Trong repo bam Add file -> Create new file.
- O ten file go dung: .github/workflows/build-apk.yml
  (go dau / de tu tao thu muc)
- Mo file build-apk.yml (co trong zip, thu muc .github/workflows) bang Notepad,
  chon het (Ctrl+A), copy, dan vao o noi dung tren GitHub.
- Bam Commit changes.

BUOC 4: Lay file APK
- Vao tab Actions. Se thay mot lan chay "Build APK" (xoay vang). Cho 5-10 phut den khi co dau tich xanh.
  Neu khong tu chay: bam "Build APK" o menu trai -> Run workflow.
- Bam vao lan chay do, keo xuong muc Artifacts, bam TinhTamTu-apk de tai zip ve.
- Giai nen duoc file TinhTamTu.apk. Gui sang dien thoai bang Google Drive hoac cap USB (dung gui qua Zalo).

KHI CAP NHAT GAME: sua src/index.html tren GitHub, commit, doi build xong, tai APK moi
va cai de len ban cu (cung khoa ky nen khong can go app).

LUU Y: debug.keystore la khoa ky mac dinh kieu debug, chi dung de ky app cho lop hoc.
