import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { spawn, type ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface TunnelInfo {
  frontendUrl: string | null;
  backendUrl: string | null;
  updatedAt: string | null;
}

@Injectable()
export class TunnelService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(TunnelService.name);
  private frontendProc: ChildProcess | null = null;
  private backendProc: ChildProcess | null = null;
  private frontendUrl: string | null = null;
  private backendUrl: string | null = null;
  private updatedAt: string | null = null;

  private readonly frontendJsonPath = path.resolve(
    process.cwd(),
    '../frontend/public/tunnel-url.json',
  );

  onApplicationBootstrap(): void {
    this.readExistingTunnelJson();
    if (!this.frontendUrl) {
      this.startCloudflaredTunnel('frontend', 9000);
    }
  }

  onModuleDestroy(): void {
    if (this.frontendProc) {
      this.frontendProc.kill();
      this.frontendProc = null;
    }
    if (this.backendProc) {
      this.backendProc.kill();
      this.backendProc = null;
    }
  }

  getTunnelInfo(): TunnelInfo {
    this.readExistingTunnelJson();
    return {
      frontendUrl: this.frontendUrl,
      backendUrl: this.backendUrl,
      updatedAt: this.updatedAt,
    };
  }

  private readExistingTunnelJson(): void {
    try {
      if (fs.existsSync(this.frontendJsonPath)) {
        const raw = fs.readFileSync(this.frontendJsonPath, 'utf-8');
        const parsed = JSON.parse(raw) as {
          url?: string;
          frontendUrl?: string;
          backendUrl?: string;
          updatedAt?: string;
        };
        if (parsed.frontendUrl || parsed.url) {
          this.frontendUrl = parsed.frontendUrl || parsed.url || null;
        }
        if (parsed.backendUrl) {
          this.backendUrl = parsed.backendUrl;
        }
        if (parsed.updatedAt) {
          this.updatedAt = parsed.updatedAt;
        }
      }
    } catch {
      // ignore
    }
  }

  private saveTunnelJson(): void {
    try {
      const dir = path.dirname(this.frontendJsonPath);
      if (!fs.existsSync(dir)) return;

      this.updatedAt = new Date().toISOString();
      const payload = {
        url: this.frontendUrl,
        frontendUrl: this.frontendUrl,
        backendUrl: this.backendUrl,
        updatedAt: this.updatedAt,
      };
      fs.writeFileSync(
        this.frontendJsonPath,
        JSON.stringify(payload, null, 2),
        'utf-8',
      );
    } catch (err) {
      this.logger.warn(`Could not write tunnel-url.json: ${String(err)}`);
    }
  }

  private startCloudflaredTunnel(
    target: 'frontend' | 'backend',
    port: number,
  ): void {
    try {
      const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      const child = spawn(
        cmd,
        [
          '--yes',
          'cloudflared',
          'tunnel',
          '--url',
          `http://127.0.0.1:${port}`,
          '--http-host-header',
          `localhost:${port}`,
        ],
        {
          stdio: ['ignore', 'pipe', 'pipe'],
          shell: true,
        },
      );

      if (target === 'frontend') {
        this.frontendProc = child;
      } else {
        this.backendProc = child;
      }

      const handleOutput = (chunk: Buffer): void => {
        const text = chunk.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
        if (match && match[0]) {
          const foundUrl = match[0];
          if (target === 'frontend' && this.frontendUrl !== foundUrl) {
            this.frontendUrl = foundUrl;
            this.logger.log(
              `Public Mobile QR URL Ready (4G/5G & Wi-Fi): ${foundUrl}`,
            );
            this.saveTunnelJson();
          } else if (target === 'backend' && this.backendUrl !== foundUrl) {
            this.backendUrl = foundUrl;
            this.logger.log(`Public Backend API URL Ready: ${foundUrl}`);
            this.saveTunnelJson();
          }
        }
      };

      child.stdout?.on('data', handleOutput);
      child.stderr?.on('data', handleOutput);
    } catch (err) {
      this.logger.warn(`Failed to spawn ${target} tunnel: ${String(err)}`);
    }
  }
}
