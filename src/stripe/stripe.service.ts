import { Injectable } from '@nestjs/common';
import { CreateStripeDto } from './dto/create-stripe.dto';
import { UpdateStripeDto } from './dto/update-stripe.dto';
import { application } from '../log/logger';
import Stripe from 'stripe';
import configuration from 'src/config/configuration';

@Injectable()
export class StripeService {
  // Stripe オブジェクト
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(configuration().stripe.secret_key);
  }

  create(createStripeDto: CreateStripeDto) {
    return 'This action adds a new stripe';
  }

  findAll() {
    return `This action returns all stripe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripe`;
  }

  update(id: number, updateStripeDto: UpdateStripeDto) {
    return `This action updates a #${id} stripe`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripe`;
  }

  test001(request: any, createStripeDto: CreateStripeDto) {
    const sig = request.headers['stripe-signature'];
    application.debug('logs1', '---');
    application.debug('logs1', 'sig: ' + sig);

    // イベントの種類
    application.debug('logs1', 'request.body.type : ' + request.body.type);

    const obj = request.body.data.object;
    application.debug('logs1', 'obj:::');
    application.debug('logs1', obj);

    application.debug('logs1', 'stripe - test001() runs.', createStripeDto);
    return { status: 'success' };
  }
}
