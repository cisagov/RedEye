/// <reference types="cypress" />

describe('Presentation Mode Navigation', () => {
	const camp = 'presentationmode';
	const fileName = 'gt.redeye';

	it('Can navigate forward and backward in Presentation Mode', () => {
		// Upload and open campaign
		cy.uploadCampaignBlue(camp, fileName);
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Verify back button is disabled, Next button is enabled
		cy.get('[cy-test=previous-slide]').should('be.disabled');
		cy.get('[cy-test=next-slide]').should('be.enabled');

		// Verify slide count starts at 1; log comment text
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '1');
		cy.get('[cy-test=presentation-item]')
			.invoke('text')
			.then((slide1) => {
				// Click "Next" three times
				cy.get('[cy-test=next-slide]').click().click().click();

				// Verify now on slide 4; previous/next buttons are enabled; verify comment text changed
				cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '4');
				cy.get('[cy-test=previous-slide]').should('be.enabled');
				cy.get('[cy-test=next-slide]').should('be.enabled');
				cy.get('[cy-test=presentation-item]')
					.invoke('text')
					.then((slide4) => {
						expect(slide4).to.not.equal(slide1);

						// Click back button twice
						cy.get('[cy-test=previous-slide]').click().click();

						// Verify now on slide 2; previous/next buttons are enabled; verify comment text changed
						cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '2');
						cy.get('[cy-test=previous-slide]').should('be.enabled');
						cy.get('[cy-test=next-slide]').should('be.enabled');
						cy.get('[cy-test=presentation-item]')
							.invoke('text')
							.then((slide2) => {
								expect(slide2).to.not.equal(slide4);
							});
					});
			});
	});

	it('Last slide takes user back to Presentation list', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Get total number of slides; go to last slide
		cy.get('[cy-test=total-slides]')
			.invoke('text')
			.then((text) => {
				const totalSlides = text.split(' ')[1];
				cy.get('[cy-test=slide-selector]').click();
				cy.get('[cy-test=slide-number-selector]')
					.eq(totalSlides - 1)
					.click();
			});

		// Verify "Next" button now says "Finish"; click button
		cy.get('[cy-test=next-slide]').should('contain', 'Finish');
		cy.get('[cy-test=next-slide]').click();

		// Verify you are taken back to Presentation list
		cy.get('[cy-test=presentation-header-bar]').should('contain', 'Present a Comment Topic');
	});

	it('Can navigate to a specific slide using dropdown', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Select slide #3 from the dropdown options
		cy.get('[cy-test=slide-selector]').click();
		cy.get('[cy-test=slide-number-selector]').eq(2).click();

		// Verify you are on slide #3
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '3');
	});

	it('Can switch between presentations using the breadcrumb menu', () => {
		// Open campaign
		cy.selectCampaign(camp);

		// Go to Presentation Mode
		cy.clickPresentationMode();

		// Click "All Comments" to open presentation
		cy.get('[cy-test=all]').click();

		// Navigate through a few slides
		cy.get('[cy-test=next-slide]').click().click().click();

		// Click "Topics" in breadcrumb to exit presentation
		cy.get('[cy-test=presentation-root]').contains('Topics').click();

		// Open #PrivilegeEscalation presentation
		cy.get('[cy-test=tag-PrivilegeEscalation]').click();

		// Verify correct presentation opened, starts at slide 1, and can navigate through slides
		cy.get('[cy-test=presentation-name]').should('contain', '#PrivilegeEscalation');
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '1');
		cy.get('[cy-test=next-slide]').click();
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '2');
		cy.get('[cy-test=next-slide]').click();
		cy.get('[cy-test=slide-selector]').invoke('text').should('equal', '3');
	});

	after(() => {
		cy.deleteCampaignGraphQL(camp);
	});
});
