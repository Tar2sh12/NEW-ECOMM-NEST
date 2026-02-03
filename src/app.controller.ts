import { Controller, Get, /**HttpStatus, ParseIntPipe,Query,DefaultValuePipe, UsePipes,*/ Body } from '@nestjs/common';
import { AppService } from './app.service';
//import { AppBodyDto } from './app.dto';
import { AppBodyType, appSchema } from './app.schema';
import { ZodValidationPipe } from './Common/Pipes';
//import { PasswordsMatcherPipe } from './Common/Pipes';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  //@UsePipes(PasswordsMatcherPipe) works in the whole request
  getHello(
    // @Query('id', ParseIntPipe) id: number,
    //@Query('id', new DefaultValuePipe(1),new ParseIntPipe({optional: false, errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number,

    //@Body(new PasswordsMatcherPipe()) body:object //works only for the body 
    // @Body(new ZodValidationPipe(appSchema)) body:AppBodyType
  ): string {
    return this.appService.getHello();
  }
}
