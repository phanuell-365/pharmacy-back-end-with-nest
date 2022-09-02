import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DrugsService } from './drugs.service';
import { CreateDrugDto, UpdateDrugDto } from './dto';
import { Roles } from '../auth/roles/decorators';
import { Role } from '../users/enums';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Roles(Role.ADMIN)
@Controller('drugs')
export class DrugsController {
  constructor(private readonly drugsService: DrugsService) {}

  @Post()
  create(@Body() createDrugDto: CreateDrugDto) {
    return this.drugsService.create(createDrugDto);
  }

  @Get()
  findAll(@Query('resource') resource: string) {
    switch (resource) {
      case 'strengths':
        return this.drugsService.findDrugStrengths();
      case 'doseForms':
        return this.drugsService.findDrugDoseForms();
      case 'issue-units':
        return this.drugsService.findIssueUnits();
    }
    return this.drugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.drugsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDrugDto: UpdateDrugDto) {
    return this.drugsService.update(id, updateDrugDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.drugsService.remove(id);
  }
}
