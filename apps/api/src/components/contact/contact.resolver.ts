import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ContactMessage,
  ContactMessageResult,
  ContactMessages,
  ContactSendResult,
} from '../../libs/dto/contact/contact';
import {
  ContactInput,
  ContactMessagesInquiry,
} from '../../libs/dto/contact/contact.input';
import { ContactStatusUpdate } from '../../libs/dto/contact/contact.update';
import { UserRole } from '../../libs/enums/user.enum';
import type { GqlContext } from '../../libs/types/auth';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GqlThrottlerGuard } from '../auth/guards/throttler.guard';
import { ContactService } from './contact.service';

@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  /** Public: "Get In Touch" form (rate limited). */
  @UseGuards(GqlThrottlerGuard)
  @Mutation(() => ContactSendResult)
  public async sendContactMessage(
    @Args('input') input: ContactInput,
    @Context() { req, res }: GqlContext,
  ): Promise<ContactSendResult> {
    return await this.contactService.sendContactMessage(input, req, res);
  }

  /*** ADMIN ***/

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => ContactMessages)
  public async getContactMessagesByAdmin(
    @Args('input', { nullable: true }) input?: ContactMessagesInquiry,
  ): Promise<ContactMessages> {
    return await this.contactService.getContactMessagesByAdmin(input ?? {});
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => ContactMessage)
  public async getContactMessageByAdmin(
    @Args('messageId') messageId: string,
  ): Promise<ContactMessage> {
    return await this.contactService.getContactMessageByAdmin(messageId);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ContactMessageResult)
  public async updateContactMessageStatusByAdmin(
    @Args('input') input: ContactStatusUpdate,
  ): Promise<ContactMessageResult> {
    return await this.contactService.updateContactMessageStatusByAdmin(input);
  }

  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => ContactMessageResult)
  public async removeContactMessageByAdmin(
    @Args('messageId') messageId: string,
  ): Promise<ContactMessageResult> {
    return await this.contactService.removeContactMessageByAdmin(messageId);
  }
}
