import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    // Thêm trường refreshTokens
    @Column({ type: 'simple-array', nullable: true })
    refreshTokens: string[];
}