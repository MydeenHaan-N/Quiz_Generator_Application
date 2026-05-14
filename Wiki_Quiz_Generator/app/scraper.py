"""
Wikipedia article scraper module.
Handles scraping and extraction of Wikipedia article content.
"""
import requests
from bs4 import BeautifulSoup
from typing import Dict, List, Optional
import re
from urllib.parse import urlparse


class WikipediaScraper:
    """Wikipedia article scraper with content extraction."""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def validate_wikipedia_url(self, url: str) -> bool:
        """
        Validate if the URL is a valid Wikipedia article URL.
        
        Args:
            url: URL to validate
            
        Returns:
            True if valid Wikipedia URL, False otherwise
        """
        try:
            parsed = urlparse(url)
            return (
                parsed.netloc.endswith('wikipedia.org') and
                '/wiki/' in parsed.path and
                ':' not in parsed.path.split('/wiki/')[-1]  # Exclude special pages
            )
        except Exception:
            return False
    
    def scrape_article(self, url: str) -> Dict:
        """
        Main scraping function to extract article data.
        
        Args:
            url: Wikipedia article URL
            
        Returns:
            Dictionary containing extracted article data
            
        Raises:
            ValueError: If URL is invalid or article not found
            requests.RequestException: If network error occurs
        """
        if not self.validate_wikipedia_url(url):
            raise ValueError("Invalid Wikipedia URL")
        
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
        except requests.RequestException as e:
            raise requests.RequestException(f"Failed to fetch article: {str(e)}")
        
        soup = BeautifulSoup(response.content, 'lxml')
        
        # Check if article exists
        if soup.find('div', class_='noarticletext'):
            raise ValueError("Article not found")
        
        return {
            'url': url,
            'title': self.extract_title(soup),
            'summary': self.extract_summary(soup),
            'sections': self.extract_sections(soup),
            'full_text': self.extract_full_text(soup),
            'raw_html': str(soup) if len(str(soup)) < 1000000 else None,  # Limit size
            'key_entities': self.extract_key_entities(soup)
        }
    
    def extract_title(self, soup: BeautifulSoup) -> str:
        """Extract article title."""
        title_element = soup.find('h1', class_='firstHeading')
        if title_element:
            return title_element.get_text().strip()
        return "Unknown Title"
    
    def extract_summary(self, soup: BeautifulSoup) -> str:
        """
        Extract article summary (first paragraph).
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            Summary text
        """
        content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            return ""
        
        # Find first paragraph that's not empty
        for p in content_div.find_all('p', recursive=False):
            text = p.get_text().strip()
            if len(text) > 50:  # Ensure it's substantial
                return text
        
        return ""
    
    def extract_sections(self, soup: BeautifulSoup) -> List[str]:
        """
        Extract section headings from the article.
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            List of section titles
        """
        sections = []
        content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            return sections
        
        # Find all h2 headings (main sections)
        for heading in content_div.find_all(['h2', 'h3']):
            headline = heading.find('span', class_='mw-headline')
            if headline:
                section_text = headline.get_text().strip()
                # Exclude references, external links, etc.
                if section_text.lower() not in ['references', 'external links', 'see also', 'notes']:
                    sections.append(section_text)
        
        return sections
    
    def extract_full_text(self, soup: BeautifulSoup) -> str:
        """
        Extract clean full text content from article.
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            Clean article text
        """
        content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            return ""
        
        # Remove unwanted elements
        for element in content_div.find_all(['table', 'script', 'style', 'sup', 'span']):
            element.decompose()
        
        # Get text from paragraphs
        paragraphs = []
        for p in content_div.find_all('p'):
            text = p.get_text().strip()
            if text:
                paragraphs.append(text)
        
        full_text = '\n\n'.join(paragraphs)
        
        # Clean up whitespace
        full_text = re.sub(r'\s+', ' ', full_text)
        full_text = re.sub(r'\n\s*\n', '\n\n', full_text)
        
        return full_text.strip()
    
    def extract_key_entities(self, soup: BeautifulSoup) -> Dict[str, List[str]]:
        """
        Extract basic key entities from article (simple extraction).
        
        Args:
            soup: BeautifulSoup object
            
        Returns:
            Dictionary with entity types and names
        """
        entities = {
            'people': [],
            'organizations': [],
            'locations': []
        }
        
        # This is a basic implementation
        # More sophisticated entity extraction will be done via LLM
        infobox = soup.find('table', class_='infobox')
        if infobox:
            # Extract from infobox rows
            for row in infobox.find_all('tr'):
                th = row.find('th')
                td = row.find('td')
                if th and td:
                    label = th.get_text().strip().lower()
                    value = td.get_text().strip()
                    
                    if any(keyword in label for keyword in ['born', 'name', 'founder']):
                        if value and len(value) < 100:
                            entities['people'].append(value)
                    elif any(keyword in label for keyword in ['location', 'city', 'country']):
                        if value and len(value) < 100:
                            entities['locations'].append(value)
        
        # Remove duplicates and limit
        entities['people'] = list(set(entities['people']))[:10]
        entities['organizations'] = list(set(entities['organizations']))[:10]
        entities['locations'] = list(set(entities['locations']))[:10]
        
        return entities


# Singleton instance
scraper = WikipediaScraper()
