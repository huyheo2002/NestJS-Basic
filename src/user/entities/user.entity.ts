import { Roles } from "src/utils/common/user.roles.enum";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({type: "enum", enum: Roles, array:true, default: [Roles.USER]})
    roles: Roles[];

    // Thêm trường refreshTokens
    @Column({ type: 'simple-array', nullable: true })
    refreshTokens: string[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;
}