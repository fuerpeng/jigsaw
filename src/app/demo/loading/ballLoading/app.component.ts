import {
    Component, ElementRef, ViewChild, Renderer2, ViewContainerRef
} from '@angular/core';
import {LoadingService} from "jigsaw/service/loading.service";
import {PopupInfo} from "jigsaw/service/popup.service";
import {JigsawBallLoading} from "jigsaw/component/loading/loading";

@Component({
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class BallLoadingDemoComponent{
    @ViewChild('block') block: ElementRef;

    constructor(public loadingService: LoadingService,
                public viewContainerRef: ViewContainerRef,
                public renderer: Renderer2) {
    }

    blockLoading: PopupInfo;
    globalLoading: PopupInfo;

    popupBlockLoading() {
        if (!this.blockLoading) {
            this.blockLoading = this.loadingService.show(this.block, JigsawBallLoading);
        }
    }

    closeBlockLoading() {
        if (this.blockLoading) {
            this.blockLoading.dispose();
            this.blockLoading = null;
        }
    }

    popupGlobalLoading() {
        if (!this.globalLoading) {
            this.globalLoading = this.loadingService.show(JigsawBallLoading);
            setTimeout(() => {
                this.closeGlobalLoading();
            }, 3000)
        }
    }

    closeGlobalLoading(){
        if(this.globalLoading){
            this.globalLoading.dispose();
            this.globalLoading = null;
        }
    }
}
