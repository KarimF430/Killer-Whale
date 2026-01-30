import { humanizeContent } from '../../server/utils/content-humanizer';

describe('Content Humanizer', () => {
    it('should neutralize positive language', () => {
        const text = 'This car is exceptional and outstanding.';
        const result = humanizeContent(text);
        expect(result).not.toContain('exceptional');
        expect(result).not.toContain('outstanding');
    });

    it('should add contractions', () => {
        const text = 'It is a good car. We are happy with it.';
        const result = humanizeContent(text);
        expect(result).toContain("It's");
        expect(result).toContain("We're");
    });
});
