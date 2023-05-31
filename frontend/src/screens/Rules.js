import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";

function Rules() {
	return (
		<Accordion eventKey="0" className="mb-12">
			<h1 className="text-4xl text-center mb-5 underline decoration-double decoration-amber-500">
				Imgger community rules
			</h1>

			<Alert className="akordeon_body">
				Imgger is a fun place where anyone is welcome to discover entertaining
				content and have their spirits lifted. We want to keep that good thing
				going, so we have created this ruleset to help guide the content on
				Imgger and express our values. We're hanging out at the best party on
				the Internet, and it's up to all of us to keep the party awesome. If you
				see a post or comment that breaks the rules, we welcome you to report it
				to the Imgger moderators:{" "}
				<a
					href="mailto:
imgger@imgger.smallhost.pl"
					className="text-blue-500"
				>
					imgger@imgger.smallhost.pl
				</a>
				.. These humans work ‘round the clock to ensure a welcoming environment
				on Imgger. These rules apply to all community aspects on Imgger: all
				parts of a public post (title, description, tags, visual content),
				comments, links, and messages. Moderators consider context and intent
				while enforcing the community rules.
			</Alert>

			<Accordion.Item eventKey="0">
				<Accordion.Header className="akordeon_header">
					No nudity or sexually explicit content.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					Imgger welcomes a diverse audience. We don't want to create a bad
					experience for someone that might stumble across explicit images, nor
					is it in our company ethos to support explicit content, so some
					lascivious or sexualized posts are not allowed. This may include
					content containing:
					<br />
					<br />
					<ul className="list-disc ml-6">
						<li>
							the gratuitous or explicit display of breasts, butts, and sexual
							organs intended to stimulate erotic feelings
						</li>
						<li>full or partial nudity</li>
						<li>
							any depiction of sexual activity, explicit or implied (drawings,
							print, animated, human, or otherwise)
						</li>
						<li>
							any image taken of or from someone without their knowledge or
							consent for the purpose of sexualization
						</li>
						<li>
							solicitation (the uninvited act of directly requesting sexual
							content from another person, or selling/offering explicit content
							and/or adult services)
						</li>
					</ul>
					Content that might be taken down may includes: see-thru clothing,
					exposed or clearly defined genitalia, some images of female
					nipples/areolas, spread eagle poses, butts in thongs or partially
					exposed buttocks, close-ups, upskirts, strip teases, cam shows, sexual
					fluids, private photos from a social media page, or linking to
					sexually explicit content. Sexually explicit comments that don't
					include images may also be removed.
					<br />
					<br />
					Artistic, scientific or educational nude images shared with
					educational context may be okay here. We don’t try to define art or
					judge the artistic merit of particular content. Instead, we focus on
					context and intent, as well as what might make content too explicit
					for the general community.
					<br />
					<br />
					Any content found to be sexualizing and exploiting minors will be
					removed and, if necessary, reported to the National Center for Missing
					& Exploited Children (NCMEC). This applies to photos, videos, animated
					imagery, descriptions and sexual jokes concerning children.
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="1">
				<Accordion.Header className="akordeon_header">
					Provocative, inflammatory, unsettling, or suggestive content should be
					marked as Mature.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					Imgger is a universal browsing experience, which means all Imggerians
					browse the same content, and you never quite know what you might see
					next. In order to ensure a welcoming browsing experience for everyone,
					some content is available only by opting-in to see mature content.
					<br />
					<br />
					Mature content may include, but is not limited to, suggestive,
					inflammatory, unsettling, or provocative jokes, stories, tags, audio,
					and visual content. This may include content containing:
					<br />
					<ul className="list-disc ml-6">
						<li>mild violence, medical work, injuries or blood</li>
						<li>scantily-clad women or men</li>
						<li>
							content that antagonizes or directly agitates a group of people
						</li>
						<li>content that makes an average person squeamish or disgusted</li>
						<li>
							non-explicit content discussing sexual experiences or fetishes
						</li>
						<li>content posted to sexualize or ogle</li>
						<li>any content intended for a mature audience</li>
					</ul>
					<br />
					Content that might be marked mature may include: surgical procedures
					or medical conditions, pimple popping, motor vehicle collisions, dead
					or injured animals, bikini photoshoots, objectification of public and
					non-public figures, vomit, graphic or upsetting stories, non-explicit
					written descriptions of sexual experiences, etc.
					<br />
					<br />
					No sexually explicit or abusive content, as defined by our community
					rules, is allowed on Imgger, even if it's marked as mature (please see
					the NO NUDITY OR EXPLICIT CONTENT rule above).
					<br />
					<br />
					Please respect the Imgger community by marking mature content as such
					on the post's options or including "NSFW" your comments. Mature
					content not marked as such will be recategorized. Adding the “mature”
					tag to a post will automatically classify the post as mature.
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="2">
				<Accordion.Header className="akordeon_header">
					No content that condones illegal or violent activity.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					Content depicting, condoning, making light of, or advocating illegal
					activity or violence will not be tolerated. This may include content
					containing:
					<br />
					<br />
					<ul className="list-disc ml-6">
						<li>
							child abuse and exploitation (includes photo, video, print,
							artwork)
						</li>
						<li>rape and domestic abuse</li>
						<li>
							sales of illegal substances or products requiring permits and/or
							licenses including pharmaceuticals, narcotics, pets, or firearms
						</li>
						<li>
							fraudulent or deceptive content intended to spread false
							information or exploit
						</li>
						<li>false impersonation</li>
						<li>brutal fights</li>
						<li>graphic injuries</li>
						<li>depictions of human death</li>
						<li>graphic violence</li>
					</ul>
					<br />
					You may not post content that is intended to incite, condone, or
					advocate for others to commit violence, mocks victims of violence, or
					includes a direct and specific threat of violence to others.
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="3">
				<Accordion.Header className="akordeon_header">
					No gore or shock content.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					Gore may include the depiction of vivid and realistic acts of violence
					and brutality. Don't post gore just to be shocking. Don't showcase the
					mutilation or torture of human beings, animals, or their remains.
					Don’t post content intended to disgust or shock the community.
					<br />
					<br />
					This may include content containing:
					<br />
					<br />
					<ul className="list-disc ml-6">
						<li>showcasing animal abuse</li>
						<li>excretion of bodily fluids intended to disgust</li>
						<li>dissection of animals for shock</li>
						<li>graphic violence</li>
					</ul>
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="4">
				<Accordion.Header className="akordeon_header">
					No posting personal information.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					To protect the safety of private individuals, we don't allow anything
					that reveals other people's personally identifiable information. This
					includes, but is not limited to, phone numbers, home addresses,
					employment information, email addresses, full names with photos, and
					personal social media accounts of non-public figures without the
					consent of the original party.
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="5">
				<Accordion.Header className="akordeon_header">
					No spam or prohibited behavior.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					TWe value authentic and interesting content, so we do not welcome:
					<br />
					<br />
					<ul className="list-disc ml-6">
						<li>
							Spam (clickbait, affiliate linking, rapid-fire posting, unapproved
							commercial advertising for dubious products and services)
						</li>
						<li>Entertainment spoilers for the purpose of trolling</li>
						<li>Scripts or bots that act maliciously or non-transparently</li>
						<li>
							Engaging in vote manipulation (using multiple accounts, voting
							services, or any other software to increase or decrease vote
							scores)
						</li>
						<li>Doing anything that interferes with normal use of Imgger</li>
						<li>
							Repeatedly creating multiple accounts to evade punishment or avoid
							restrictions
						</li>
					</ul>
				</Accordion.Body>
			</Accordion.Item>
			<Accordion.Item eventKey="6">
				<Accordion.Header className="akordeon_header">
					No hate speech, abuse, or harassment.
				</Accordion.Header>
				<Accordion.Body className="akordeon_body">
					Imgger is open to anyone, so we take down hate speech, divisive
					content, and abusive content when we see it. This may include content
					containing:
					<br />
					<br />
					<ul className="list-disc ml-6">
						<li>
							attacks on people based on their race, ethnicity, national origin,
							religion, sex, gender, sexual orientation, age, disability or
							medical condition
						</li>
						<li>
							glorification or endorsement of hateful content or ideologies
						</li>
						<li>
							content depicting or advocating discrimination of a group
							especially so as to distinguish it as inferior or superior to
							another
						</li>
						<li>
							harassment in the forms of witch hunting, sexual harassment,
							repetitive unwanted or obsessive attention, aggressive
							intimidation, suicide requests or threats, or inciting the
							community into support or disdain for a person, organization or
							community
						</li>
						<li>
							content that attacks, bullies, or harrasses non-public people
						</li>
						<li>
							any image taken of or from someone without their knowledge or
							consent for the purpose of harassment, abuse, or revenge
						</li>
					</ul>
					<br />
					<br />
					Posts that might be taken down may include: brigading, slurs, negative
					stereotypes, hate-based threats, hate speech, glorification of abuse,
					malicious personal attacks on non-public individuals, doxxing,
					slander, ad-hominem attacks directed at another individual, “fat
					people hate,” misogyny, visual content intended to cause medical harm
					(i.e. induce seizures), photos taken of a non-public figure without
					their knowledge to make fun of them, sending unsolicited sexual
					imagery via messages.
					<br />
					<br />
					It's important to keep in mind that not everything that's mean or
					insulting is hate speech. That said, the line between unintentional
					and serious attacks is sometimes difficult to identify, so we're
					likely to err on the side of taking abusive content down.
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
}

export default Rules;
