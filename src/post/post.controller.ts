import { Controller, Get, Post, Put, Delete } from "@nestjs/common";
import { PostService } from "./post.service";

@Controller("post")
export class PostController {
    constructor(private postService: PostService) {

    }

    @Get("get-all")
    getAllPosts() {

    }

    @Get("get-post-by-id")
    getPostById() {

    }

    @Post("create-post")
    createPost() {

    }

    @Put("update-post")
    replacePost() {

    }

    @Delete("delete-post")
    deletePost() {
        
    }
}