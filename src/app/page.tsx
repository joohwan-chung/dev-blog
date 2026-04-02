import { HomeWrapper } from '@/components/common/home-wrapper';
import { getDatabasePages, getSelfIntroducePage } from '@/lib/notion';
import { NotionBlock } from '@/types/notion';

// 프로덕션 환경에서도 최신 데이터를 가져오도록 설정
export const revalidate = 0;

export default async function Home() {
  // 최근 포스트와 자기소개 페이지 데이터 가져오기
  const [posts, selfIntroducePage] = await Promise.all([
    getDatabasePages(),
    getSelfIntroducePage()
  ]);

  // 자기소개 페이지에서 기술 스택 정보 추출
  const extractSkillsFromContent = (content: NotionBlock[]) => {
    const skills: { [key: string]: string[] } = {};
    
    content.forEach((block, index) => {
      if (block.type === 'heading_2' && block.content?.rich_text?.[0]?.plain_text) {
        const heading = block.content.rich_text[0].plain_text;
        if (heading.includes('FrontEnd') || heading.includes('BackEnd') || heading.includes('DevOps')) {
          const currentCategory = heading;
          skills[currentCategory] = [];
          
          // 다음 블록들에서 기술 스택 정보 추출
          for (let i = index + 1; i < content.length; i++) {
            const nextBlock = content[i];
            
            // 다른 h2 헤더를 만나면 중단
            if (nextBlock.type === 'heading_2' && nextBlock.content?.rich_text?.[0]?.plain_text) {
              break;
            }
            
            // bulleted_list_item에서 기술 스택 추출
            if (nextBlock.type === 'bulleted_list_item' && nextBlock.content?.rich_text?.[0]?.plain_text) {
              const skillText = nextBlock.content.rich_text[0].plain_text;
              // "- " 접두사 제거하고 기술명만 추출
              const skill = skillText.replace(/^-\s*/, '').trim();
              if (skill) {
                skills[currentCategory].push(skill);
              }
            }
          }
        }
      }
    });
    
    return skills;
  };

  const skills = selfIntroducePage ? extractSkillsFromContent(selfIntroducePage.content) : {};

  return <HomeWrapper posts={posts} skills={skills} />;
}
