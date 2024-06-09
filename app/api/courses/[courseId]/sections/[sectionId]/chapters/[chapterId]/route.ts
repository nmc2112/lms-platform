import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "@/node_modules/next/server";

const mux = new Mux({
    tokenId:process.env.MUX_TOKEN_ID,
    tokenSecret:process.env.MUX_TOKEN_SECRET,
});

export async function DELETE(
    req: Request,
    {params}: {params:{ courseId:string;sectionId:string; chapterId:string}}
){
    try {
        const { userId } = auth();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownSection = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId
            }
        })

        if(!ownSection){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const chapter = await db.chapter.findUnique({
            where:{
                id: params.chapterId,
                sectionId: params.sectionId,
            }
        }) 

        if(!chapter){
            return new NextResponse("Not Found", {status: 404})
        }

        if(chapter.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where:{
                    chapterId: params.chapterId
                }
            })
            if(existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        });

        const publishedChaptersInSection = await db.chapter.findMany({
            where: {
                sectionId: params.sectionId,
                isPublished: true
            }
        })

        if(!publishedChaptersInSection.length){
            await db.section.update({
                where: {
                    id: params.sectionId,
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(deletedChapter);

    } catch (error) {
        console.log("[CHAPTER_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500})
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: {
        sectionId: string;
        chapterId: string
    }}
){
    try {
        const { userId } = auth();

        const {isPublished, ...values} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const ownSection = await db.section.findUnique({
            where:{
                id: params.sectionId
            }
        })

        if(!ownSection){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const chapter = await db.chapter.update({
            where:{
                id: params.chapterId,
                sectionId: params.sectionId,
            },
            data:{
                ...values
            }
        }) 

        if(values.videoUrl){

            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,
                }
            });

            if(existingMuxData) {
                await mux.video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    }
                });
            }

            const asset = await mux.video.assets.create({
                input: values.videoUrl,
                playback_policy: ["public"]
            });

            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id,
                }
            });
        }

        return NextResponse.json(chapter);

    } catch (error) {
        console.log("[SECTION_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }
}