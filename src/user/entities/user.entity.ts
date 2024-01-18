import { Roles } from "src/utils/common/user.roles.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({type: "enum", enum: Roles, array:true, default: [Roles.USER]})
    roles: Roles[];

    // Thêm trường refreshTokens
    @Column({ type: 'simple-array', nullable: true })
    refreshTokens: string[];
}