import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/createReport.dto';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gaurds/auth.gaurd';
import { currentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveBodyDto } from './dtos/approveBody.dto';
import { AdminGaurd } from 'src/gaurds/admin.guard';
import { GetEstimteDto } from './dtos/getEstimate.dto';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
 
    constructor(private reportsService: ReportsService) {}


    @Post()
    @serialize(ReportDto)
    createReport(@Body() data:CreateReportDto, @currentUser() user: User){
        return this.reportsService.create(data, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGaurd)
    approveReport(@Param('id') id: string, @Body() body: ApproveBodyDto){
        return this.reportsService.changeApproval(id, body);
    }

    @Get()
    async getEstimate(@Query() body: GetEstimteDto){
        return await this.reportsService.getEstimate(body);
    }
}
