import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const targetJsonPath = resolve(process.cwd(), 'public', 'tunnel-url.json');

console.log('🚀 กำลังสร้างลิงก์ออนไลน์สาธารณะ (Cloudflare Tunnel) สำหรับสแกน QR สั่งอาหาร...');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  [
    '--yes',
    'cloudflared',
    'tunnel',
    '--url',
    'http://localhost:9000',
    '--http-host-header',
    'localhost:9000',
  ],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  },
);

const extractTunnelUrl = (chunk) => {
  const text = chunk.toString();
  process.stdout.write(text);

  const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && match[0]) {
    const publicUrl = match[0];
    try {
      writeFileSync(
        targetJsonPath,
        JSON.stringify({ url: publicUrl, updatedAt: new Date().toISOString() }, null, 2),
        'utf-8',
      );
      console.log('\n============================================================');
      console.log(`✅ เชื่อมต่อสำเร็จ! ลิงก์ QR ออนไลน์ของคุณถูกซิงก์เข้าหน้าเว็บอัตโนมัติแล้ว:`);
      console.log(`🔗 ${publicUrl}`);
      console.log('📱 ตอนนี้เปิดหน้า QR Code บนเว็บแล้วเอามือถือ (4G/5G หรือ Wi-Fi) สแกนได้เลย!');
      console.log('============================================================\n');
    } catch (err) {
      console.error('Failed to write tunnel-url.json:', err);
    }
  }
};

child.stdout.on('data', extractTunnelUrl);
child.stderr.on('data', extractTunnelUrl);

child.on('close', (code) => {
  console.log(`Tunnel process exited with code ${code}`);
});
