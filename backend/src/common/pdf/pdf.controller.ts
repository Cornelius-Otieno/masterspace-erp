import {
  Controller,
  Get,
  Param,
  Req,
  StreamableFile,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PdfService } from './pdf.service';

const documentTypes = new Set([
  'invoices',
  'purchase-orders',
  'quotations',
  'delivery-notes',
  'receipts',
  'work-orders',
]);

@UseGuards(JwtAuthGuard)
@Controller('documents')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get(':type/:id/pdf')
  async download(@Param('type') type: string, @Param('id') id: string, @Req() request: Request) {
    if (!documentTypes.has(type)) throw new UnauthorizedException('Unsupported document type');
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
    if (!token) throw new UnauthorizedException();

    const pdf = await this.pdfService.renderDocument(`/${type}/${id}`, token);
    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: `attachment; filename="${type}-${id}.pdf"`,
    });
  }
}