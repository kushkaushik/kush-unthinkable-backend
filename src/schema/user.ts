import {Schema , Prop , SchemaFactory} from '@nestjs/mongoose'
import  mongoose,{ Document } from 'mongoose'

export type UserDocument = Document & User

@Schema({
    timestamps  : true
})

export class User{
    @Prop({required : true})
    number : number

    @Prop()
    name : string

    @Prop()
    image : string

    @Prop()
    gender : string
}

export const UserSchema = SchemaFactory.createForClass(User)