import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    // Log request
    console.log(`➡️  ${method} ${originalUrl} - ${new Date().toISOString()}`);

    // Capture response
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const logMessage = `⬅️  ${method} ${originalUrl} ${statusCode} - ${duration}ms`;

      // Color code based on status
      if (statusCode >= 500) {
        console.error(`🔴 ${logMessage}`);
      } else if (statusCode >= 400) {
        console.warn(`🟡 ${logMessage}`);
      } else {
        console.log(`🟢 ${logMessage}`);
      }
    });

    next();
  }
}
