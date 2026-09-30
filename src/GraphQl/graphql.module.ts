import {Module} from '@nestjs/common';
import {OrderResolver} from './Resolvers/order.resolver';
import { OrderModule } from 'src/Modules';

@Module({
  imports: [OrderModule],
  controllers: [],
  providers: [OrderResolver],
  exports: [],
})
export class GQLModule {}
