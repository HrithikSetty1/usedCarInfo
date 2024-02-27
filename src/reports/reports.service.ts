import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/createReport.dto';
import { User } from 'src/users/user.entity';
import { ApproveBodyDto } from './dtos/approveBody.dto';
import { GetEstimteDto } from './dtos/getEstimate.dto';

@Injectable()
export class ReportsService {

    constructor(@InjectRepository(Report) private reportsRepository: Repository<Report>){}

    create(data: CreateReportDto, user: User){
       const report =  this.reportsRepository.create(data);
       report.user = user;
       return this.reportsRepository.save(report);
    }

    async changeApproval(id:string, body:ApproveBodyDto){
        const report = await this.reportsRepository.findOne({
            where:{
                id: parseInt(id),
            }
        });
        console.log(report);
        if(!report){
            throw new NotFoundException('Invalid id');
        }
        report.approved = body.approved;
        return this.reportsRepository.save(report);
    }

    async getEstimate(req:GetEstimteDto){
        return this.reportsRepository.createQueryBuilder()
            .select('AVG(price)','price')
            .where('make = :make', { make: req.make})
            .andWhere('model = :model', { model: req.model})
            .andWhere('long - :lng BETWEEN -5 AND 5',{long: req.long})
            .andWhere('lat - :lat BETWEEN -5 AND 5',{lat: req.lat})
            .andWhere('year - :year BETWEEN -3 AND 3', {year: req.year})
            .orderBy('mileage - :mileage', 'DESC')
            .setParameters({mileage: req.mileage})
            .limit(3)
            .getRawOne();
    } 
}
