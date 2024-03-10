import { 
  Box, 
  Heading, 
  Link, 
  List, 
  ListItem, 
  Text, 
  UnorderedList, 
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
 } from '@chakra-ui/react';

const TermsAndConditions = () => {
  return (
    <Box p="40px 80px 40px 80px">
      <VStack spacing={5} align="stretch" textAlign="justify">
        <Heading as="h1" size="xl">Terms and Conditions</Heading>
        
        <Text>Welcome to green-ify.life Terms and Conditions! These terms and conditions list the rules and regulations for using the Greenify website, located at <Link href="https://www.green-ify.life" isExternal color="teal.500">https://www.green-ify.life</Link>. By accessing this website, we understand that you accept these terms and conditions. Do not continue to use green-ify.life if you do not agree to all of the terms and conditions stated on this page.</Text>
        
        <Accordion allowToggle>
          {/* Item 1 */}
          <AccordionItem>
            <AccordionButton>
              <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight= 'bold'>
                Cookie
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            
            <AccordionPanel pb={4}>
            The website uses cookies to help personalize your online experience. By accessing green-ify.life, you have agreed to use the required cookies. A cookie is a text file that the web server places on your hard disk. Cookies are not used to run programs or transmit viruses to your computer. The cookie is uniquely assigned to you and can only be read by the web server in the domain that issued the cookie to you. We may use cookies to collect, store, and track information for statistical or marketing purposes to operate our website. You can accept or decline Cookies. Some cookies are essential for the operation of our website. These cookies do not require your consent as they are always active. 
            Please note that by accepting the required Cookies, you also accept third-party Cookies, which may be used through services provided by third parties if you use those services on our website, such as third-party-provided video display windows integrated into our website.
            </AccordionPanel>
          </AccordionItem>

          {/* Item 2 */}
          <AccordionItem>
            <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight= 'bold'>
                License
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Text>Unless otherwise specified, Greenify and/or its licensors own the intellectual property rights for all materials on green-ify.life. All intellectual property rights are reserved. You may access this section from green-ify.life for your own personal use, subject to the restrictions set out in these terms and conditions.</Text>
            <UnorderedList spacing={2}>
              <ListItem>Copy or republish materials from green-ify.life</ListItem>
              <ListItem>Sell, rent, or license materials from green-ify.life</ListItem>
              <ListItem>Copy, duplicate, or copy materials from green-ify.life</ListItem>
              <ListItem>Redistribute content from green-ify.life</ListItem>
            </UnorderedList>
            
            <Text>This agreement will begin on the date of this contract. Portions of this website provide users with the opportunity to post and exchange opinions and information in certain areas of the website. Greenify does not filter, edit, publish, or review comments before they appear on the website. Comments do not reflect the views and opinions of Greenify, its agents, and/or affiliates. Comments reflect the views and opinions of the person who posts the comments and their opinions. To the extent permitted by applicable law, Greenify shall not be liable for comments or any legal liability, damage, or costs arising from and/or attributable to any use and/or posting and/or appearance of comments on this website. Greenify has the right to monitor all comments and remove any comments that may be deemed inappropriate, offensive, or in violation of these terms and conditions.</Text>
            
            <Text>You warrant and represent that:</Text>
            <UnorderedList spacing={2}>
              <ListItem>You are entitled to post comments on our website and have all necessary licenses and consents to do so</ListItem>
              <ListItem>Comments do not infringe any intellectual property rights, including but not limited to copyright, patent, or trademark of any third party</ListItem>
              <ListItem>Comments do not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material, which is an invasion of privacy</ListItem>
              <ListItem>Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activities</ListItem>
            </UnorderedList>
            
            <Text>Hereby, you grant Greenify a non-exclusive license to use, reproduce, edit, and authorize others to use, reproduce, and edit any and all of your comments in any and all forms, formats, or media.</Text>
            </AccordionPanel>
          </AccordionItem>

          {/* Item 3 */}
          <AccordionItem>
            <AccordionButton>
            <Box as="span" flex='1' textAlign='left' fontSize="lg" fontWeight= 'bold'>
                  <Text size="lg">Hyperlinks to Our Content</Text>
              </Box>
              <AccordionIcon/>
            </AccordionButton>
            <AccordionPanel pb={4}>
            <Text>The following organizations may link to our website without prior written approval:</Text>
        <UnorderedList spacing={2}>
          <ListItem>Government agencies</ListItem>
          <ListItem>Search engines</ListItem>
          <ListItem>News organizations</ListItem>
          <ListItem>Online directory distributors may link to our website in the same manner as they hyperlink to the websites of other listed businesses</ListItem>
          <ListItem>Systemwide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our website.</ListItem>
        </UnorderedList>
        
        <Text>These organizations may link to our home page, to publications, or to other website information so long as the link:</Text>
        <UnorderedList spacing={2}>
          <ListItem>is not in any way deceptive</ListItem>
          <ListItem>does not falsely imply sponsorship, endorsement, or approval of the linking party and its products and/or services</ListItem>
          <ListItem>fits within the context of the linking party's site</ListItem>
        </UnorderedList>
        
        <Text>We may consider and approve other link requests from the following types of organizations:</Text>
        <UnorderedList spacing={2}>
          <ListItem>commonly-known consumer and/or business information sources</ListItem>
          <ListItem>dot.com community sites</ListItem>
          <ListItem>associations or other groups representing charities</ListItem>
          <ListItem>online directory distributors</ListItem>
          <ListItem>internet portals</ListItem>
          <ListItem>accounting, law and consulting firms</ListItem>
          <ListItem>educational institutions and trade associations</ListItem>
        </UnorderedList>
        
        <Text>We will approve link requests from these organizations if we decide that:</Text>
        <UnorderedList spacing={2}>
          <ListItem>the link would not make us look unfavorably to ourselves or to our accredited businesses</ListItem>
          <ListItem>the organization does not have any negative records with us</ListItem>
          <ListItem>the benefit to us from the visibility of the hyperlink compensates the absence of Greenify</ListItem>
          <ListItem>the link is in the context of general resource information</ListItem>
        </UnorderedList>
        
        <Text>These organizations may link to our home page so long as the link:</Text>
        <UnorderedList spacing={2}>
          <ListItem>is not in any way deceptive</ListItem>
          <ListItem>does not falsely imply sponsorship, endorsement, or approval of the linking party and its products or services</ListItem>
          <ListItem>fits within the context of the linking party's site</ListItem>
        </UnorderedList>
        
        <Text>If you are one of the organizations listed in paragraph 2 above and are interested in linking to our website, you must inform us by sending an e-mail to Greenify. Please include your name, your organization name, contact information as well as the URL of your site, a list of any URLs from which you intend to link to our Website, and a list of the URLs on our site to which you would like to link. Wait 2-3 weeks for a response. Approved organizations may hyperlink to our website as follows:</Text>
        <UnorderedList spacing={2}>
          <ListItem>By use of our corporate name</ListItem>
          <ListItem>By use of the uniform resource locator being linked to</ListItem>
          <ListItem>By use of any other description of our website being linked to that makes sense within the context and format of content on the linking party's site</ListItem>
        </UnorderedList>
        
        <Text>No use of Greenify's logo or other artwork will be allowed for linking absent a trademark license agreement.</Text>

            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        
      </VStack>
    </Box>
  );
};

export default TermsAndConditions;
